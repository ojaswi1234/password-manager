import { useEffect, useState, useCallback } from 'react';
import NavBar from "../../components/NavBar";
import { ThemeProvider } from "../../components/theme-provider";
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || '';

interface CredentialMeta {
  _id: string;
  platform: string;
  email: string;
  legacy: boolean;      // old bcrypt hashed, cannot decrypt
  decryptable: boolean; // new format
}

const DashBoard = () => {
  const [credentials, setCredentials] = useState<CredentialMeta[]>([]);
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, string>>({});
  const [revealLoading, setRevealLoading] = useState<Record<string, boolean>>({});
  const [revealError, setRevealError] = useState<Record<string, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const fetchCredentials = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/credentials`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.status === 401) {
        navigate('/Welcome');
        return;
      }
      const data = await response.json();
      if (data.success) {
        setCredentials(data.accounts);
      } else {
        setError('Failed to fetch credentials.');
      }
    } catch (err) {
      console.error('An error occurred while fetching:', err);
      setError('An error occurred while fetching.');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const checkAuthentication = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/dashboard`, {
        method: 'GET',
        credentials: 'include'
      });
      if (response.ok) {
        fetchCredentials();
      } else {
        navigate('/Welcome');
      }
    } catch (err) {
      console.error('Authentication check failed:', err);
      navigate('/Welcome');
    }
  }, [navigate, fetchCredentials]);

  useEffect(() => {
    checkAuthentication();
    try { Modal.setAppElement('#root'); } catch { /* ignore in tests/env without DOM */ }
  }, [checkAuthentication]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    try {
      const response = await fetch(`${API_BASE}/saved`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        setIsModalOpen(false);
        fetchCredentials(); // Refetch to update the list
      } else {
        setError('Failed to save credential.');
      }
    } catch (err) {
      console.error('An error occurred while saving:', err);
      setError('An error occurred while saving.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/credentials/${id}/delete`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      if (result.success) {
        fetchCredentials(); // Refetch to update the list
      }
      else {
        setError('Failed to delete credential.');
      }
    } catch (err) {
      console.error('An error occurred while deleting:', err);
      setError('An error occurred while deleting.');
    }
    finally {
      setIsLoading(false);
    }
  };
  const revealPassword = async (id: string) => {
    // If already revealed do nothing
    if (revealedPasswords[id]) {
      setRevealed(prev => ({ ...prev, [id]: !prev[id] }));
      return;
    }
    setRevealLoading(r => ({ ...r, [id]: true }));
    setRevealError(r => ({ ...r, [id]: '' }));
    try {
      const resp = await fetch(`${API_BASE}/credentials/${id}`, { credentials: 'include' });
      if (resp.status === 401) {
        navigate('/Welcome');
        return;
      }
      const data = await resp.json();
      if (data.success && data.account) {
        setRevealedPasswords(p => ({ ...p, [id]: data.account.password }));
        setRevealed(prev => ({ ...prev, [id]: true }));
      } else {
        setRevealError(r => ({ ...r, [id]: 'Failed to reveal' }));
      }
    } catch (e) {
      console.error('Reveal error', e);
      setRevealError(r => ({ ...r, [id]: 'Error revealing password' }));
    } finally {
      setRevealLoading(r => ({ ...r, [id]: false }));
    }
  };

  const toggleReveal = (id: string, decryptable: boolean, legacy: boolean) => {
    if (legacy) {
      // Cannot decrypt legacy bcrypt hashed entry
      setRevealed(prev => ({ ...prev, [id]: !prev[id] }));
      return;
    }
    if (revealedPasswords[id]) {
      // Already have it, just toggle
      setRevealed(prev => ({ ...prev, [id]: !prev[id] }));
    } else if (decryptable) {
      revealPassword(id);
    }
  };

  const copyPassword = async (id: string) => {
    const value = revealedPasswords[id];
    if (!value) return;
  try { await navigator.clipboard.writeText(value); } catch { /* ignore clipboard errors */ }
  };

  return (
    <>
      <ThemeProvider>
        <main className="w-screen min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-900 dark:to-zinc-800">
          <NavBar />
          <div className="w-full p-6">
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">Dashboard</h1>
            <p className="text-center text-gray-600 dark:text-gray-400 text-lg">Manage your passwords and settings here.</p>
            {error && <p className="text-center text-red-500">{error}</p>}
          </div>
          <div className="w-full mt-8 p-6 flex flex-col">
            <button
              id="dialogBtn"
              onClick={() => setIsModalOpen(true)}
              className="w-fit p-3 bg-black dark:bg-white rounded-2xl mb-6 flex justify-center items-center place-self-center-safe lg:place-self-end-safe cursor-pointer hover:scale-105 transition-transform lg:mr-24"
              disabled={isLoading}
            >
              <span className="text-white dark:text-black font-bold">+ Add Credential</span>
            </button>
            <Modal
              isOpen={isModalOpen}
              onRequestClose={() => setIsModalOpen(false)}
              shouldCloseOnOverlayClick={true}
              overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
              className="bg-white/95 dark:bg-zinc-800/95 backdrop-blur-md rounded-2xl p-8 max-w-md mx-4 outline-none shadow-2xl shadow-black dark:shadow-zinc-400"
              contentLabel="Create item"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Add Credentials</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Add your credentials for respective platforms</p>
                <form className="space-y-6 flex flex-col" onSubmit={handleSave}>
                  <select name="platform" className="w-full p-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                    <option value="">Select a platform</option>
                    <option value="google">Google</option>
                    <option value="microsoft">Microsoft</option>
                    <option value="amazon">Amazon</option>
                    <option value="instagram">Instagram</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="facebook">Facebook</option>
                    <option value="x">X</option>
                    <option value="other">Other</option>
                  </select>
                  <input name="email" className="w-full p-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter your Username/Email..." required />
                  <input name="password" className="w-full p-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent" type="password" placeholder="Enter your Password..." required />
                  <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 dark:bg-zinc-600 hover:bg-gray-300 dark:hover:bg-zinc-500 rounded-lg cursor-pointer transition-colors">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg cursor-pointer flex-1 flex justify-center items-center transition-colors" disabled={isLoading}>
                      {isLoading ? 'Saving...' : 'ADD'} <span className="font-bold ml-2">+</span>
                    </button>
                  </div>
                </form>
              </div>
            </Modal>
            <div className="container min-h-fit mx-auto p-8 bg-white/70 dark:bg-zinc-800/70 backdrop-blur-md rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {credentials.map((item) => (
                <div key={item._id} className="p-4 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 shadow hover:shadow-lg transition-shadow relative">
                  <section className="mb-2 flex flex-row  justify-center gap-2 ">
                    {item.platform === 'google' && <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="fill-black dark:fill-white size-8" 
fill="currentColor" viewBox="0 0 24 24" >

<path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.91 8.91 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625"></path>
</svg>}
                    {item.platform === 'microsoft' && <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24"   className="fill-black dark:fill-white size-8" 
fill="currentColor" viewBox="0 0 24 24" >

<path d="M11.55 21H3v-8.55h8.55zM21 21h-8.55v-8.55H21zm-9.45-9.45H3V3h8.55zm9.45 0h-8.55V3H21z"></path>
</svg>  }
                 {item.platform === 'linkedin' &&  <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24"   className="fill-black dark:fill-white size-8" 
fill="currentColor" viewBox="0 0 24 24" >
<path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1M8.339 18.337H5.667v-8.59h2.672zM7.003 8.574a1.548 1.548 0 1 1 0-3.096 1.548 1.548 0 0 1 0 3.096m11.335 9.763h-2.669V14.16c0-.996-.018-2.277-1.388-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248h-2.667v-8.59h2.56v1.174h.037c.355-.675 1.227-1.387 2.524-1.387 2.704 0 3.203 1.778 3.203 4.092v4.71z"></path>
</svg>}
{item.platform === 'amazon' && <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24"   className="fill-black dark:fill-white size-8" 
fill="currentColor" viewBox="0 0 24 24" >
<path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2m5.93 15.36c-.26.39-.63.7-1.08.87-.45.17-.96.19-1.41.06-.45-.13-.83-.39-1.11-.73-.28-.34-.44-.76-.44-1.21v-1.09H8v1.09c0 .45-.16.87-.44 1.21-.28.34-.66.6-1.11.73-.45.13-.96.11-1.41-.06-.45-.17-.82-.48-1.08-.87-.26-.39-.39-.84-.39-1.32v-6.06c0-.48.13-.93.39-1.32.26-.39.63-.7 1.08-.87.45-.17.96-.19 1.41-.06.45.13.83.39 1.11.73.28.34.44.76.44 1.21v1.09h2.56v-1.09c0-.45.16-.87.44-1.21.28-.34.66-.6 1.11-.73.45-.13.96-.11 1.41.06.45.17.82.48 1.08.87.26.39.39.84.39 1.32v6.06c0 .48-.13.93-.39 1.32z"></path>
</svg>}
{item.platform === 'instagram' && <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24"  className="fill-black dark:fill-white size-8" 
fill="currentColor" viewBox="0 0 24 24" >
<path d="M11.999 7.377a4.623 4.623 0 1 0 0 9.248 4.623 4.623 0 0 0 0-9.248m0 7.627a3.004 3.004 0 1 1 0-6.008 3.004 3.004 0 0 1 0 6.008M16.806 6.129a1.078 1.078 0 1 0 0 2.156 1.078 1.078 0 1 0 0-2.156"></path><path d="M20.533 6.111A4.6 4.6 0 0 0 17.9 3.479a6.6 6.6 0 0 0-2.186-.42c-.963-.042-1.268-.054-3.71-.054s-2.755 0-3.71.054a6.6 6.6 0 0 0-2.184.42 4.6 4.6 0 0 0-2.633 2.632 6.6 6.6 0 0 0-.419 2.186c-.043.962-.056 1.267-.056 3.71s0 2.753.056 3.71c.015.748.156 1.486.419 2.187a4.6 4.6 0 0 0 2.634 2.632 6.6 6.6 0 0 0 2.185.45c.963.042 1.268.055 3.71.055s2.755 0 3.71-.055a6.6 6.6 0 0 0 2.186-.419 4.61 4.61 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.186.043-.962.056-1.267.056-3.71s0-2.753-.056-3.71a6.6 6.6 0 0 0-.421-2.217m-1.218 9.532a5 5 0 0 1-.311 1.688 2.99 2.99 0 0 1-1.712 1.711 5 5 0 0 1-1.67.311c-.95.044-1.218.055-3.654.055-2.438 0-2.687 0-3.655-.055a5 5 0 0 1-1.669-.311 2.99 2.99 0 0 1-1.719-1.711 5.1 5.1 0 0 1-.311-1.669c-.043-.95-.053-1.218-.053-3.654s0-2.686.053-3.655a5 5 0 0 1 .311-1.687c.305-.789.93-1.41 1.719-1.712a5 5 0 0 1 1.669-.311c.951-.043 1.218-.055 3.655-.055s2.687 0 3.654.055a5 5 0 0 1 1.67.311 3 3 0 0 1 1.712 1.712 5.1 5.1 0 0 1 .311 1.669c.043.951.054 1.218.054 3.655s0 2.698-.043 3.654z"></path>
</svg> }

{item.platform === 'x' && <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24"  className="fill-black dark:fill-white size-8" 
fill="currentColor" viewBox="0 0 24 24" >

<path d="M13.68 10.62 20.24 3h-1.55L13 9.62 8.45 3H3.19l6.88 10.01L3.19 21h1.55l6.01-6.99 4.8 6.99h5.24l-7.13-10.38Zm-2.13 2.47-.7-1-5.54-7.93H7.7l4.47 6.4.7 1 5.82 8.32H16.3z"></path>
</svg>}

{item.platform === 'facebook' && <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24"  className="fill-black dark:fill-white size-8" 
fill="currentColor" viewBox="0 0 24 24" >

<path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8.615v-6.96h-2.338v-2.725h2.338v-2c0-2.325 1.42-3.592 3.5-3.592q1.05-.003 2.095.107v2.42h-1.435c-1.128 0-1.348.538-1.348 1.325v1.735h2.697l-.35 2.725h-2.348V21H20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1"></path>
</svg>}
{item.platform === 'other' && <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24"  className="fill-black dark:fill-white size-8" 
fill="currentColor" viewBox="0 0 24 24" >
<path d="M19 19h2v2h-2zM7 19h2v2H7zM11 19h2v2h-2zM15 19h2v2h-2zM3 19h2v2H3zM3 15h2v2H3zM3 7h2v2H3zM3 11h2v2H3zM3 3h2v2H3zM7 3h2v2H7zM15 3h2v2h-2zM11 3h2v2h-2zM19 3h2v2h-2zM19 11h2v2h-2zM19 15h2v2h-2zM19 7h2v2h-2zM11 15h2v2h-2zM11 7h2v2h-2zM7 11h2v2H7zM15 11h2v2h-2zM11 11h2v2h-2z"></path>
</svg>}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 capitalize">{item.platform}</h3>
                  </section>
                  <hr></hr>
                  <p className="text-gray-600 dark:text-gray-300 break-all">{item.email}</p>
                  <div className="mt-1">
                    {item.legacy && (
                      <p className="text-xs text-amber-600 dark:text-amber-400">Legacy entry – cannot decrypt</p>
                    )}
                    {!item.legacy && (
                      <>
                        <p className="text-gray-600 dark:text-gray-300 font-mono select-all">
                          {revealed[item._id] ? (revealedPasswords[item._id] || '…') : '••••••••'}
                        </p>
                        {revealError[item._id] && <p className="text-xs text-red-500">{revealError[item._id]}</p>}
                        <div className="flex gap-3 mt-2">
                          <button
                            type="button"
                            onClick={() => toggleReveal(item._id, item.decryptable, item.legacy)}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:text-gray-400"
                            disabled={revealLoading[item._id]}
                          >
                            {revealLoading[item._id] ? 'Loading…' : revealed[item._id] ? 'Hide' : 'Show'}
                          </button>
                          {revealed[item._id] && revealedPasswords[item._id] && (
                            <button
                              type="button"
                              onClick={() => copyPassword(item._id)}
                              className="text-sm text-green-600 dark:text-green-400 hover:underline"
                            >Copy</button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  <button className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg cursor-pointer transition-colors flex place-self-end" onClick={()=>{
                    handleDelete(item._id);
                  }}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </ThemeProvider>
    </>
  );
};

export default DashBoard;