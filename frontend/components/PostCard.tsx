'use client';

import { useState, useEffect } from 'react';
import { likesApi, commentsApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Post, Comment } from '@/lib/api/types';

const LikeIcon = ({ liked }: { liked: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={liked ? "#0866ff" : "none"} stroke={liked ? "none" : "#65676b"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
);
import CommentItem from './CommentItem';

interface PostCardProps {
    post: Post;
    onDelete?: (postId: string) => void;
}

export default function PostCard({ post, onDelete }: PostCardProps) {
    const auth = useAuth();
    const { user } = auth;
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState('');
    const [loading, setLoading] = useState(false);
    const [showLikesModal, setShowLikesModal] = useState(false);
    const [likedUsers, setLikedUsers] = useState<any[]>([]);
    const [isHovering, setIsHovering] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content || '');

    useEffect(() => {
        fetchLikes();
    }, [post._id]);

    const fetchLikes = async () => {
        try {
            const response = await likesApi.getLikes('Post', post._id);
            setLikeCount(response.count);

            // Check if current user has liked
            const userLiked = response.data.some((like: { user: { _id: string | undefined; }; }) => like.user._id === user?._id);
            setLiked(userLiked);
        } catch (error) {
            console.error('Failed to fetch likes:', error);
        }
    };

    const fetchLikedUsers = async () => {
        try {
            const response = await likesApi.getLikeUsers('Post', post._id);
            setLikedUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch liked users:', error);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await commentsApi.getComments(post._id);
            setComments(response.data);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        }
    };

    const handleLike = async () => {
        try {
            const response = await likesApi.toggleLike('Post', post._id);
            setLiked(response.liked);
            setLikeCount(prev => response.liked ? prev + 1 : prev - 1);
        } catch (error) {
            console.error('Failed to toggle like:', error);
        }
    };

    const handleShowLikes = () => {
        if (likeCount > 0) {
            fetchLikedUsers();
            setShowLikesModal(true);
        }
    };

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setLoading(true);
        try {
            const response = await commentsApi.createComment(post._id, commentText);
            setComments([...comments, response.data]);
            setCommentText('');
        } catch (error) {
            console.error('Failed to create comment:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleComments = () => {
        if (!showComments) {
            fetchComments();
        }
        setShowComments(!showComments);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this post?')) {
            onDelete && onDelete(post._id);
            setShowDropdown(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditContent(post.content || '');
        setShowDropdown(false);
    };

    const handleSaveEdit = () => {
        // For now, just update locally - backend API for edit can be added later
        post.content = editContent;
        setIsEditing(false);
        alert('Edit saved locally. Backend API integration pending.');
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditContent(post.content || '');
    };

    // Check if current user is the post owner
    const isOwner = Boolean(
        user?._id &&
        post?.author?._id &&
        (String(user._id) === String(post.author._id))
    );

    // Debug logging
    console.log('=== Post Ownership Check ===');
    console.log('Post ID:', post._id);
    console.log('Current User ID:', user?._id);
    console.log('Post Author ID:', post.author?._id);
    console.log('User ID (string):', String(user?._id || ''));
    console.log('Author ID (string):', String(post.author?._id || ''));
    console.log('Is Owner:', isOwner);
    console.log('===========================');

    // Image is already a data URI from MongoDB (e.g., "data:image/png;base64,...")
    const imageUrl = post.image || null;

    return (
        <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
            <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
                <div className="_feed_inner_timeline_post_top">
                    <div className="_feed_inner_timeline_post_box">
                        <div className="_feed_inner_timeline_post_box_image">
                            <img src="/assets/images/post_img.png" alt="" className="_post_img" />
                        </div>
                        <div className="_feed_inner_timeline_post_box_txt">
                            <h4 className="_feed_inner_timeline_post_box_title">
                                {post.author.firstName} {post.author.lastName}
                            </h4>
                            <p className="_feed_inner_timeline_post_box_para">
                                {new Date(post.createdAt).toLocaleDateString()} ·
                                <span className="_mar_l4">
                                    {post.privacy === 'public' ? '🌍 Public' : '🔒 Private'}
                                </span>
                            </p>
                        </div>
                    </div>
                    {isOwner && (
                        <div className="_feed_inner_timeline_post_box_dropdown" style={{ position: 'relative' }}>
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '8px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="#65676b">
                                    <circle cx="10" cy="3" r="2" />
                                    <circle cx="10" cy="10" r="2" />
                                    <circle cx="10" cy="17" r="2" />
                                </svg>
                            </button>

                            {showDropdown && (
                                <div style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: '100%',
                                    backgroundColor: '#fff',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)',
                                    minWidth: '200px',
                                    zIndex: 10,
                                    overflow: 'hidden'
                                }}>
                                    <button
                                        onClick={handleEdit}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: 'none',
                                            background: 'none',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            fontSize: '15px',
                                            color: '#050505',
                                            transition: 'background-color 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        ✏️ Edit Post
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: 'none',
                                            background: 'none',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            fontSize: '15px',
                                            color: '#050505',
                                            transition: 'background-color 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        🗑️ Delete Post
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {isEditing ? (
                    <div style={{ padding: '12px 0' }}>
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            style={{
                                width: '100%',
                                minHeight: '80px',
                                padding: '12px',
                                fontSize: '15px',
                                border: '1px solid #e4e6eb',
                                borderRadius: '8px',
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                        />
                        <div style={{ marginTop: '8px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={handleCancelEdit}
                                className="btn btn-secondary btn-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="btn btn-primary btn-sm"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    post.content && (
                        <h4 className="_feed_inner_timeline_post_title">{post.content}</h4>
                    )
                )}

                {imageUrl && (
                    <div className="_feed_inner_timeline_image">
                        <img src={imageUrl} alt="Post" className="_time_img" />
                    </div>
                )}
            </div>

            <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
                {likeCount > 0 && (
                    <div className="_feed_inner_timeline_total_reacts_image">
                        <div onClick={handleShowLikes} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <span style={{
                                backgroundColor: '#0866ff',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '6px'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#fff">
                                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                                </svg>
                            </span>
                            <span className="_feed_inner_timeline_total_reacts_para">{likeCount}</span>
                        </div>
                    </div>
                )}
                <div className="_feed_inner_timeline_total_reacts_txt">
                    <p className="_feed_inner_timeline_total_reacts_para1">
                        <Link href="#0" onClick={toggleComments}>
                            <span>{comments.length}</span> Comment{comments.length !== 1 ? 's' : ''}
                        </Link>
                    </p>
                </div>
            </div>

            <div className="_feed_inner_timeline_reaction">
                <button
                    className={`_feed_inner_timeline_reaction_emoji _feed_reaction ${liked ? '_feed_reaction_active' : ''}`}
                    onClick={handleLike}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    style={{ position: 'relative' }}
                >
                    <span className="_feed_inner_timeline_reaction_link">
                        <LikeIcon liked={liked} />
                        <span style={{ marginLeft: '8px' }}>{liked ? 'Liked' : 'Like'}</span>
                    </span>
                    {isHovering && likeCount > 0 && (
                        <div
                            style={{
                                position: 'absolute',
                                bottom: '100%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                color: '#fff',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                whiteSpace: 'nowrap',
                                zIndex: 10,
                                marginBottom: '4px',
                            }}
                        >
                            {likeCount} {likeCount === 1 ? 'person' : 'people'} liked this
                        </div>
                    )}
                </button>

                <button
                    className="_feed_inner_timeline_reaction_comment _feed_reaction"
                    onClick={toggleComments}
                >
                    <span className="_feed_inner_timeline_reaction_link">
                        <span>
                            <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none" viewBox="0 0 21 21">
                                <path stroke="#000" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z" />
                                <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" d="M6.938 9.313h7.125M10.5 14.063h3.563" />
                            </svg>
                            Comment
                        </span>
                    </span>
                </button>
            </div>

            {showComments && (
                <div className="_padd_r24 _padd_l24 _mar_t16">
                    <form onSubmit={handleComment} className="_mar_b16">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Write a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                disabled={loading}
                                style={{ borderRadius: '20px' }}
                            />
                            <button className="btn btn-primary" type="submit" disabled={loading || !commentText.trim()} style={{ borderRadius: '20px', marginLeft: '8px' }}>
                                {loading ? 'Posting...' : 'Post'}
                            </button>
                        </div>
                    </form>

                    <div className="_comments_list">
                        {comments.map(comment => (
                            <CommentItem
                                key={comment._id}
                                comment={comment}
                                onDelete={(id) => setComments(comments.filter(c => c._id !== id))}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Likes Modal */}
            {showLikesModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                            <div className="modal-header" style={{ borderBottom: 'none', padding: '16px 16px 0' }}>
                                <h5 className="modal-title" style={{ fontSize: '18px', fontWeight: '600' }}>People who liked this</h5>
                                <button type="button" className="btn-close" onClick={() => setShowLikesModal(false)} style={{ fontSize: '12px' }}></button>
                            </div>
                            <div className="modal-body" style={{ maxHeight: '400px', overflowY: 'auto', padding: '16px' }}>
                                <ul className="list-group list-group-flush">
                                    {likedUsers.map((u: any) => (
                                        <li key={u._id} className="list-group-item d-flex align-items-center" style={{ border: 'none', padding: '8px 0' }}>
                                            <img src="/assets/images/profile.png" alt="Profile" style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '12px' }} />
                                            <span style={{ fontWeight: '500' }}>{u.firstName} {u.lastName}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
