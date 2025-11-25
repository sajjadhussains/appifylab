'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { postsApi } from '@/lib/api';
import CreatePostForm from './CreatePostForm';
import PostCard from './PostCard';
import { Post } from '@/lib/api/types';

export default function FeedMiddle() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await postsApi.getPosts();
            setPosts(response.data);
        } catch (err: any) {
            setError(err.message || 'Failed to load posts');
        } finally {
            setLoading(false);
        }
    };

    const handlePostCreated = (newPost: Post) => {
        setPosts([newPost, ...posts]);
    };

    const handlePostDelete = async (postId: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            await postsApi.deletePost(postId);
            setPosts(posts.filter(post => post._id !== postId));
        } catch (err: any) {
            alert('Failed to delete post: ' + err.message);
        }
    };

    return (
        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
            <div className="_layout_middle_wrap">
                <div className="_layout_middle_inner">
                    {/* Stories Section - Desktop */}
                    <div className="_feed_inner_ppl_card _mar_b16">
                        <div className="_feed_inner_story_arrow">
                            <button type="button" className="_feed_inner_story_arrow_btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="8" fill="none" viewBox="0 0 9 8">
                                    <path fill="#fff" d="M8 4l.366-.341.318.341-.318.341L8 4zm-7 .5a.5.5 0 010-1v1zM5.566.659l2.8 3-.732.682-2.8-3L5.566.66zm2.8 3.682l-2.8 3-.732-.682 2.8-3 .732.682zM8 4.5H1v-1h7v1z" />
                                </svg>
                            </button>
                        </div>
                        <div className="row">
                            <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col">
                                <div className="_feed_inner_profile_story _b_radious6 ">
                                    <div className="_feed_inner_profile_story_image">
                                        <img src="/assets/images/card_ppl1.png" alt="Image" className="_profile_story_img" />
                                        <div className="_feed_inner_story_txt">
                                            <div className="_feed_inner_story_btn">
                                                <button className="_feed_inner_story_btn_link">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                                                        <path stroke="#fff" strokeLinecap="round" d="M.5 4.884h9M4.884 9.5v-9" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <p className="_feed_inner_story_para">Your Story</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col">
                                <div className="_feed_inner_public_story _b_radious6">
                                    <div className="_feed_inner_public_story_image">
                                        <img src="/assets/images/card_ppl2.png" alt="Image" className="_public_story_img" />
                                        <div className="_feed_inner_pulic_story_txt">
                                            <p className="_feed_inner_pulic_story_para">Ryan Roslansky</p>
                                        </div>
                                        <div className="_feed_inner_public_mini">
                                            <img src="/assets/images/mini_pic.png" alt="Image" className="_public_mini_img" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 _custom_mobile_none">
                                <div className="_feed_inner_public_story _b_radious6">
                                    <div className="_feed_inner_public_story_image">
                                        <img src="/assets/images/card_ppl3.png" alt="Image" className="_public_story_img" />
                                        <div className="_feed_inner_pulic_story_txt">
                                            <p className="_feed_inner_pulic_story_para">Ryan Roslansky</p>
                                        </div>
                                        <div className="_feed_inner_public_mini">
                                            <img src="/assets/images/mini_pic.png" alt="Image" className="_public_mini_img" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 _custom_none">
                                <div className="_feed_inner_public_story _b_radious6">
                                    <div className="_feed_inner_public_story_image">
                                        <img src="/assets/images/card_ppl4.png" alt="Image" className="_public_story_img" />
                                        <div className="_feed_inner_pulic_story_txt">
                                            <p className="_feed_inner_pulic_story_para">Ryan Roslansky</p>
                                        </div>
                                        <div className="_feed_inner_public_mini">
                                            <img src="/assets/images/mini_pic.png" alt="Image" className="_public_mini_img" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stories Section - Mobile */}
                    <div className="_feed_inner_ppl_card_mobile _mar_b16">
                        <div className="_feed_inner_ppl_card_area">
                            <ul className="_feed_inner_ppl_card_area_list">
                                <li className="_feed_inner_ppl_card_area_item">
                                    <Link href="#0" className="_feed_inner_ppl_card_area_link">
                                        <div className="_feed_inner_ppl_card_area_story">
                                            <img src="/assets/images/mobile_story_img.png" alt="Image" className="_card_story_img" />
                                            <div className="_feed_inner_ppl_btn">
                                                <button className="_feed_inner_ppl_btn_link" type="button">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12">
                                                        <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" d="M6 2.5v7M2.5 6h7" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <p className="_feed_inner_ppl_card_area_link_txt">Your Story</p>
                                    </Link>
                                </li>
                                <li className="_feed_inner_ppl_card_area_item">
                                    <Link href="#0" className="_feed_inner_ppl_card_area_link">
                                        <div className="_feed_inner_ppl_card_area_story_active">
                                            <img src="/assets/images/mobile_story_img1.png" alt="Image" className="_card_story_img1" />
                                        </div>
                                        <p className="_feed_inner_ppl_card_area_txt">Ryan...</p>
                                    </Link>
                                </li>
                                <li className="_feed_inner_ppl_card_area_item">
                                    <Link href="#0" className="_feed_inner_ppl_card_area_link">
                                        <div className="_feed_inner_ppl_card_area_story_inactive">
                                            <img src="/assets/images/mobile_story_img2.png" alt="Image" className="_card_story_img1" />
                                        </div>
                                        <p className="_feed_inner_ppl_card_area_txt">Ryan...</p>
                                    </Link>
                                </li>
                                <li className="_feed_inner_ppl_card_area_item">
                                    <Link href="#0" className="_feed_inner_ppl_card_area_link">
                                        <div className="_feed_inner_ppl_card_area_story_active">
                                            <img src="/assets/images/mobile_story_img1.png" alt="Image" className="_card_story_img1" />
                                        </div>
                                        <p className="_feed_inner_ppl_card_area_txt">Ryan...</p>
                                    </Link>
                                </li>
                                <li className="_feed_inner_ppl_card_area_item">
                                    <Link href="#0" className="_feed_inner_ppl_card_area_link">
                                        <div className="_feed_inner_ppl_card_area_story_inactive">
                                            <img src="/assets/images/mobile_story_img2.png" alt="Image" className="_card_story_img1" />
                                        </div>
                                        <p className="_feed_inner_ppl_card_area_txt">Ryan...</p>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Create Post Form */}
                    <CreatePostForm onPostCreated={handlePostCreated} />

                    {/* Error Message */}
                    {error && (
                        <div className="alert alert-danger _mar_b16" role="alert">
                            {error}
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center _padd_t24 _padd_b24">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}

                    {/* Posts List */}
                    {!loading && posts.length === 0 && (
                        <div className="text-center _padd_t24 _padd_b24">
                            <p>No posts yet. Be the first to post!</p>
                        </div>
                    )}

                    {!loading && posts.map(post => (
                        <PostCard
                            key={post._id}
                            post={post}
                            onDelete={handlePostDelete}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
