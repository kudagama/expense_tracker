'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import styles from '../auth.module.css';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Edit form state
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [defaultSalary, setDefaultSalary] = useState('');
  const [defaultSalaryDate, setDefaultSalaryDate] = useState('');
  const [saving, setSaving] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setName(data.user.name || '');
          setDefaultSalary(data.user.defaultSalary || '');
          setDefaultSalaryDate(data.user.defaultSalaryDate || '');
        } else {
          router.push('/login');
        }
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, defaultSalary, defaultSalaryDate })
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success('Profile updated successfully!');
        setUser(data.user);
        setIsEditing(false);
      } else {
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className={styles.container}>
        <div style={{ color: 'var(--text-muted)' }}>Loading profile...</div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #334155' }
      }} />
      <div className={styles.card} style={{ maxWidth: '500px' }}>
        <h1 className={styles.title}>Your Profile</h1>
        <p className={styles.subtitle}>Manage your account and preferences</p>
        
        {!isEditing ? (
          <>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%', 
                background: 'var(--gradient-primary)', margin: '0 auto 1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.5rem', fontWeight: 'bold', color: 'white',
                boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)'
              }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{user?.name}</h2>
              <p style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
            </div>
            
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Default Preferences</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Default Salary:</span>
                <span style={{ fontWeight: 'bold' }}>Rs. {user?.defaultSalary?.toLocaleString() || '0'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Default Salary Date:</span>
                <span style={{ fontWeight: 'bold' }}>{user?.defaultSalaryDate ? new Date(user.defaultSalaryDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not set'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <button onClick={() => setIsEditing(true)} className={styles.button} style={{ flex: 1, margin: 0 }}>
                Edit Profile
              </button>
            </div>
            
            <Link href="/" style={{ display: 'block', width: '100%', textDecoration: 'none', marginBottom: '1rem' }}>
              <button className={styles.button} style={{ background: 'rgba(255,255,255,0.05)', boxShadow: 'none', margin: 0, border: '1px solid var(--border-color)' }}>
                Back to Dashboard
              </button>
            </Link>

            <button onClick={handleLogout} className={styles.button} style={{ background: 'transparent', color: 'var(--danger-color)', border: '1px solid var(--danger-color)', boxShadow: 'none', margin: 0 }}>
              Logout
            </button>
          </>
        ) : (
          <form onSubmit={handleSave}>
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input 
                type="text" 
                className={styles.input} 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>
            <div className={styles.formGroup}>
              <label>Default Monthly Salary (Rs.)</label>
              <input 
                type="number" 
                className={styles.input} 
                value={defaultSalary}
                onChange={(e) => setDefaultSalary(e.target.value)}
                placeholder="e.g. 50000"
              />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>This amount will be automatically filled when a new month begins.</p>
            </div>
            <div className={styles.formGroup}>
              <label>Default Salary Date</label>
              <input 
                type="date" 
                className={styles.input} 
                value={defaultSalaryDate}
                onChange={(e) => setDefaultSalaryDate(e.target.value)}
                style={{ colorScheme: 'dark' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="submit" className={styles.button} disabled={saving} style={{ flex: 1, margin: 0, background: 'var(--success-color)' }}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className={styles.button} style={{ flex: 1, margin: 0, background: 'var(--surface-hover)', boxShadow: 'none' }}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
