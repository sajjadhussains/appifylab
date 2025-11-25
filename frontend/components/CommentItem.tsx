'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { likesApi, commentsApi } from '@/lib/api';
import { Comment } from '@/lib/api/types';
import Link from 'next/link';

interface CommentItemProps {
    comment: Comment;
    onDelete?: (commentId: string) => void;
}

export default function CommentItem({ comment, onDelete }: CommentItemProps) {
    const { user } = useAuth();
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [showReplies, setShowReplies] = useState(false);
    const [replies, setReplies] = useState<Comment[]>([]);
    const [replyText, setReplyText] = useState('');
    const [loadingReplies, setLoadingReplies] = useState(false);
    const [submittingReply, setSubmittingReply] = useState(false);
    const [showLikesModal, setShowLikesModal] = useState(false);
    const [likedUsers, setLikedUsers] = useState<any[]>([]);

    useEffect(() => {
        fetchLikes();
    }, [comment._id]);

    const fetchLikes = async () => {
        try {
            const response = await likesApi.getLikes('Comment', comment._id);
            setLikeCount(response.count);
            const userLiked = response.data.some((like: any) => like.user._id === user?._id);
            setLiked(userLiked);
        } catch (error) {
            console.error('Failed to fetch comment likes:', error);
        }
    };

    const fetchLikedUsers = async () => {
        try {
            const response = await likesApi.getLikeUsers('Comment', comment._id);
            setLikedUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch liked users:', error);
        }
    };

    const handleLike = async () => {
        try {
            const response = await likesApi.toggleLike('Comment', comment._id);
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

    const fetchReplies = async () => {
        if (showReplies && replies.length > 0) {
            setShowReplies(false);
            return;
        }

        setLoadingReplies(true);
        try {
            const response = await commentsApi.getReplies(comment._id);
            setReplies(response.data);
            setShowReplies(true);
        } catch (error) {
            console.error('Failed to fetch replies:', error);
        } finally {
            setLoadingReplies(false);
        }
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        setSubmittingReply(true);
        try {
            const response = await commentsApi.createReply(comment._id, replyText);
            setReplies([...replies, response.data]);
            setReplyText('');
            setShowReplies(true); // Ensure replies are visible
        } catch (error) {
            console.error('Failed to create reply:', error);
        } finally {
            setSubmittingReply(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Delete this comment?')) return;
        try {
            await commentsApi.deleteComment(comment._id);
            if (onDelete) onDelete(comment._id);
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    const isOwner = user?._id === comment.author._id;

    return (
        <div className="_comment_item _mar_b16" style={{ marginLeft: comment.parentComment ? '20px' : '0' }}>
            <div className="d-flex align-items-start">
                <img
                    src="/assets/images/profile.png"
                    alt="Profile"
                    style={{ width: '32px', height: '32px', borderRadius: '50%', marginRight: '10px' }}
                />
                <div className="flex-grow-1">
                    <div className="_comment_content _b_radious6" style={{ backgroundColor: '#f0f2f5', padding: '8px 12px', display: 'inline-block' }}>
                        <h6 className="_mar_b4" style={{ fontSize: '14px', fontWeight: 600 }}>
                            {comment.author.firstName} {comment.author.lastName}
                        </h6>
                        <p className="_mar_b0" style={{ fontSize: '14px' }}>{comment.content}</p>
                    </div>

                    <div className="_comment_actions _mar_t4" style={{ fontSize: '12px', color: '#65676b' }}>
                        <span
                            onClick={handleLike}
                            style={{ cursor: 'pointer', fontWeight: liked ? 'bold' : 'normal', color: liked ? '#377DFF' : 'inherit', marginRight: '12px' }}
                        >
                            Like
                        </span>
                        <span
                            onClick={() => setShowReplies(!showReplies)}
                            style={{ cursor: 'pointer', marginRight: '12px' }}
                        >
                            Reply
                        </span>
                        <span style={{ marginRight: '12px' }}>
                            {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                        {likeCount > 0 && (
                            <span
                                onClick={handleShowLikes}
                                style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#377DFF" style={{ marginRight: '4px' }}>
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                {likeCount}
                            </span>
                        )}
                        {isOwner && (
                            <span
                                onClick={handleDelete}
                                style={{ cursor: 'pointer', marginLeft: '12px', color: '#dc3545' }}
                            >
                                Delete
                            </span>
                        )}
                    </div>

                    {/* Replies List */}
                    {showReplies && (
                        <div className="_replies_list _mar_t8">
                            {loadingReplies ? (
                                <div className="spinner-border spinner-border-sm text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            ) : (
                                replies.map(reply => (
                                    <CommentItem
                                        key={reply._id}
                                        comment={reply}
                                        onDelete={(id) => setReplies(replies.filter(r => r._id !== id))}
                                    />
                                ))
                            )}

                            {/* Reply Input */}
                            <form onSubmit={handleReply} className="_mar_t8" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Write a reply..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    disabled={submittingReply}
                                    style={{ borderRadius: '20px', flex: 1 }}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleReply(e);
                                        }
                                    }}
                                />
                                <button
                                    type="submit"
                                    disabled={submittingReply || !replyText.trim()}
                                    style={{
                                        padding: '6px 16px',
                                        borderRadius: '20px',
                                        border: 'none',
                                        backgroundColor: replyText.trim() ? '#1877f2' : '#e4e6eb',
                                        color: replyText.trim() ? '#fff' : '#bcc0c4',
                                        cursor: replyText.trim() ? 'pointer' : 'not-allowed',
                                        fontWeight: 600,
                                        fontSize: '13px'
                                    }}
                                >
                                    {submittingReply ? '...' : 'Send'}
                                </button>
                            </form>
                        </div>
                    )}

                    {!showReplies && (comment.repliesCount || 0) > 0 && (
                        <div
                            className="_view_replies _mar_t4"
                            style={{ fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: '#65676b' }}
                            onClick={fetchReplies}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-return-right" viewBox="0 0 16 16" style={{ marginRight: '6px' }}>
                                <path fillRule="evenodd" d="M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5z" />
                            </svg>
                            {comment.repliesCount} Repl{(comment.repliesCount || 0) === 1 ? 'y' : 'ies'}
                        </div>
                    )}
                </div>
            </div>

            {/* Likes Modal */}
            {showLikesModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
                    <div className="modal-dialog modal-dialog-centered modal-sm">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Likes</h5>
                                <button type="button" className="btn-close" onClick={() => setShowLikesModal(false)}></button>
                            </div>
                            <div className="modal-body" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {likedUsers.map((u: any) => (
                                    <div key={u._id} className="d-flex align-items-center _mar_b12">
                                        <img src="/assets/images/profile.png" alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%', marginRight: '10px' }} />
                                        <span>{u.firstName} {u.lastName}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
