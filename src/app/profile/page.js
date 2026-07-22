'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import styles from '../auth.module.css'; // Reusing auth styles for card layout

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
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
      <div className={styles.card}>
        <h1 className={styles.title}>Your Profile</h1>
        <p className={styles.subtitle}>Manage your account</p>
        
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%', 
            background: 'var(--gradient-primary)', margin: '0 auto 1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 'bold', color: 'white'
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{user?.name}</h2>
          <p style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
        </div>
        
        <Link href="/" style={{ display: 'block', width: '100%', textDecoration: 'none' }}>
          <button className={styles.button} style={{ background: 'rgba(255,255,255,0.1)', boxShadow: 'none', marginBottom: '1rem' }}>
            Back to Dashboard
          </button>
        </Link>

        <button onClick={handleLogout} className={styles.button} style={{ background: 'var(--danger-color)' }}>
          Logout
        </button>
      </div>
    </main>
  );
}
