import React, { useEffect, useState } from 'react';
import { configureEcho } from "@laravel/echo-react";
import { useEcho, useEchoPublic, useEchoPresence } from "@laravel/echo-react";


const WsTest = () => {
    const [counts, setCounts] = useState({ public: 0, private: 0, presence: 0 });
    const [presenceUsers, setPresenceUsers] = useState([]);

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

configureEcho({
    broadcaster: "reverb",
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: "localhost",
    wsPort: 6001,
    forceTLS: false,
    enabledTransports: ['ws'],
    authEndpoint: "https://localhost/broadcasting/auth",
    authorizer: (channel, options) => {
            return {
                authorize: (socketId, callback) => {
                    fetch("https://localhost/broadcasting/auth", {
                        method: "POST",
                        credentials: "include",
                        headers: {"content-type": "application/json"},
                        body: JSON.stringify({socket_id: socketId, channel_name: channel.name})
                    })
                    .then(res => res.json()).then(data => callback(false, data)).catch(err => callback(true, err));
                }
            };
        },
});

    useEcho("reverb-ping-private", "Ping", (e) => {
        setCounts(prev => ({ ...prev, private: prev.private + 1 }));
    }, );

    useEchoPublic("reverb-ping-public", "Ping", (e) => {
        setCounts(prev => ({ ...prev, public: prev.public + 1 }));
    });

    useEchoPresence("reverb-ping-presence", "Ping", (e) => {
        setCounts(prev => ({ ...prev, presence: prev.presence + 1 }));
    });

    const triggerPing = async (type) => {        
        try {
            const response = await fetch(`https://localhost/reverb-ping-${type}`, {
                method: "GET",
                credentials: "include",
                headers: {
                   "Content-Type": "application/json",
                   "X-XSRF-TOKEN": decodeURIComponent(getCookie('XSRF-TOKEN')),
                },
            });

            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log("OKI :)")
        } catch (err) {
            console.error("Ping failed:", err);
        }
    };

return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>Reverb Echo Test</h1>
            <hr />
            
            <div style={{ display: 'flex', gap: '20px' }}>
                {/* Public Card */}
                <div style={cardStyle}>
                    <h3>Public</h3>
                    <p>Count: <strong>{counts.public}</strong></p>
                    <button onClick={() => triggerPing('public')}>Ping Public</button>
                </div>

                {/* Private Card */}
                <div style={cardStyle}>
                    <h3>Private</h3>
                    <p>Count: <strong>{counts.private}</strong></p>
                    <button onClick={() => triggerPing('private')}>Ping Private</button>
                </div>

                {/* Presence Card */}
                <div style={cardStyle}>
                    <h3>Presence</h3>
                    <p>Count: <strong>{counts.presence}</strong></p>
                    <p><small>Active Users: {presenceUsers.length}</small></p>
                    <button onClick={() => triggerPing('presence')}>Ping Presence</button>
                </div>
            </div>
        </div>
    );
};

const cardStyle = { border: '1px solid #ccc', padding: '15px', borderRadius: '8px', textAlign: 'center', minWidth: '150px' };

export default WsTest;