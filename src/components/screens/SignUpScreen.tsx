import { useState } from 'react';
import { useNavigate } from 'react-router';
import { MobileContainer } from '../MobileContainer';
import { ArrowLeft, User, Mail, Lock, Phone, MapPin } from 'lucide-react';

export function SignUpScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    region: '',
  });

  const regions = [
    'North America',
    'South America',
    'Europe',
    'Asia',
    'Africa',
    'Australia',
    'Antarctica'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <MobileContainer>
      <div className="h-full flex flex-col" style={{ backgroundColor: '#e9dff8' }}>
        {/* Header */}
        <div className="p-6 pb-4">
          <button onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="w-7 h-7 text-text" />
          </button>
          <h2 style={{ color: '#403361' }} className="mb-2 text-center">Welcome To the</h2>
          <h2 style={{ color: '#403361' }} className="text-center">Housemate Community</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 px-6 pb-8 overflow-y-auto">
          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="text-text mb-2 block">Name</label>
              <input
                type="text"
                placeholder=""
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-surface rounded-2xl px-4 py-3 text-text"
                style={{ border: '4px solid #403361' }}
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-text mb-2 block">Email</label>
              <input
                type="email"
                placeholder=""
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-surface rounded-2xl px-4 py-3 text-text"
                style={{ border: '4px solid #403361' }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-text mb-2 block">Password</label>
              <input
                type="password"
                placeholder=""
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-surface rounded-2xl px-4 py-3 text-text"
                style={{ border: '4px solid #403361' }}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-text mb-2 block">Phone</label>
              <input
                type="tel"
                placeholder=""
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-surface rounded-2xl px-4 py-3 text-text"
                style={{ border: '4px solid #403361' }}
              />
            </div>

            {/* Region */}
            <div>
              <label className="text-text mb-2 block">Region</label>
              <select
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full bg-surface rounded-2xl px-4 py-3 text-text"
                style={{ border: '4px solid #403361' }}
              >
                <option value="">Select a region</option>
                {regions.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="h-6"></div>
          
          <button
            type="submit"
            className="w-full py-4 rounded-3xl text-white transition-all duration-200 active:scale-95"
            style={{ 
              backgroundColor: '#403361',
              boxShadow: 'var(--shadow-medium)'
            }}
          >
            Sign Up
          </button>
        </form>
      </div>
    </MobileContainer>
  );
}