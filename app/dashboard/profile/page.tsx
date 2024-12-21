"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface Profile {
    name: string;
    email: string;
    preferences: string[];
    role: string;
}

const ProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('Token');
        if (!token) {
            router.push('/login');
            return;
        }
        const fetchProfile = async () => {
            try {
                const response = await fetch('/api/dashboard/profile', {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                } else {
                    setError('Failed to fetch profile');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                setError('Failed to fetch profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Profile) => {
        if (profile) {
            setProfile({ ...profile, [field]: e.target.value });
        }
    };

    const handlePreferencesChange = (index: number, value: string) => {
        if (profile) {
            const newPreferences = [...profile.preferences];
            if (value.trim() === '') {
                newPreferences.splice(index, 1);
            } else {
                newPreferences[index] = value;
            }
            setProfile({ ...profile, preferences: newPreferences });
        }
    };

    const handleAddPreference = () => {
        if (profile) {
            setProfile({ ...profile, preferences: [...profile.preferences, 'preference'] });
        }
    };

    const handleRemovePreference = (index: number) => {
        if (profile) {
            const newPreferences = profile.preferences.filter((_, i) => i !== index);
            setProfile({ ...profile, preferences: newPreferences });
        }
    };

    const handleUpdateProfile = async () => {
        const token = Cookies.get('Token');
        if (!token || !profile) return;

        try {
            const response = await fetch('/api/dashboard/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(profile),
            });

            if (!response.ok) {
                setError('Failed to update profile');
            } else {
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Failed to update profile');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="text-black min-h-screen p-5">
            {profile ? (
                <div>
                <h1 className="text-2xl font-bold">
                    {isEditing ? (
                        <span className="flex items-center">
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => handleInputChange(e, 'name')}
                                className="border rounded px-2 py-1"
                            />
                            <button
                                className="ml-3 px-2 py-1 text-sm text-blue-500 hover:underline"
                                onClick={() => setIsEditing(true)}
                            >
                                edit
                            </button>
                        </span>
                    ) : (
                        <span>
                            {profile.name}
                        </span>
                    )}
                </h1>
                <p className="mt-2">Email: {profile.email}</p>
                <p>Role: {profile.role}</p>

                <h2 className="mt-5 text-xl font-semibold">Preferences</h2>
                <ul className="mt-3 space-y-2">
                    {profile.preferences.map((preference, index) => (
                    <li key={index} className="flex items-center space-x-3">
                        {isEditing ? (
                        <>
                            <input
                            type="text"
                            value={preference}
                            onChange={(e) => handlePreferencesChange(index, e.target.value)}
                            className="border rounded px-2 py-1 flex-1"
                            />
                            <button
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            onClick={() => handleRemovePreference(index)}
                            >
                            Remove
                            </button>
                        </>
                        ) : (
                        preference
                        )}
                    </li>
                    ))}
                </ul>

                {isEditing && (
                    <button
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    onClick={handleAddPreference}
                    >
                    Add Preference
                    </button>
                )}

                <div className="mt-5">
                    {isEditing ? (
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        onClick={handleUpdateProfile}
                    >
                        Update Profile
                    </button>
                    ) : (
                    <button
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit Profile
                    </button>
                    )}
                </div>
                </div>
            ) : (
                <div className="text-center text-gray-500">No profile data available</div>
            )}
            </div>
    );
};

export default ProfilePage;