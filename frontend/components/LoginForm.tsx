'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (!result.success) {
            setError(result.error || 'Login failed');
        }

        setLoading(false);
    };

    return (
        <div className="_social_login_content">
            <div className="_social_login_left_logo _mar_b28">
                <img src="/assets/images/logo.svg" alt="Image" className="_left_logo" />
            </div>
            <p className="_social_login_content_para _mar_b8">Welcome back</p>
            <h4 className="_social_login_content_title _titl4 _mar_b50">Login to your account</h4>

            {error && (
                <div className="alert alert-danger _mar_b20" role="alert">
                    {error}
                </div>
            )}

            <form className="_social_login_form" onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="_social_login_form_input _mar_b14">
                            <label className="_social_login_label _mar_b8">Email</label>
                            <input
                                type="email"
                                className="form-control _social_login_input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="_social_login_form_input _mar_b14">
                            <label className="_social_login_label _mar_b8">Password</label>
                            <input
                                type="password"
                                className="form-control _social_login_input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
                        <div className="form-check _social_login_form_check">
                            <input
                                className="form-check-input _social_login_form_check_input"
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                disabled={loading}
                            />
                            <label className="form-check-label _social_login_form_check_label" htmlFor="rememberMe">
                                Remember me
                            </label>
                        </div>
                    </div>
                    <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
                        <div className="_social_login_form_left">
                            <p className="_social_login_form_left_para">Forgot password?</p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                        <div className="_social_login_form_btn _mar_t40 _mar_b60">
                            <button
                                type="submit"
                                className="_social_login_form_btn_link _btn1"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login now'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            <div className="row">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div className="_social_login_bottom_txt">
                        <p className="_social_login_bottom_txt_para">
                            Don't have an account? <Link href="/register">Create New Account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
