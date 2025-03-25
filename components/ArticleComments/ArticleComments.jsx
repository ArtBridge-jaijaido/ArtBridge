import { addComment, subscribeToComments } from "@/services/articleCommentService";
import { useState, useEffect } from "react";
import { formatTime } from "@/lib/functions";
import "./ArticleComment.css";

const ArticleComment = ({ userUid, articleId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToComments(userUid, articleId, setComments);
    return () => unsubscribe();
  }, [userUid, articleId]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    await addComment(userUid, articleId, {
      content: newComment,
      nickname: currentUser.nickname || "匿名使用者",
      avatar: currentUser.profileAvatar || "/images/kv-min-4.png",
      userUid: currentUser.uid,
    });

    setNewComment(""); // 清空輸入框
  };

  return (
    <div className="ArticleComment-section">
      <div className="ArticleComment-list">
        {comments.map((comment) => (
          <div key={comment.id} className="ArticleComment-item">
            <div className="ArticleComment-header">
              <img src={comment.avatar} alt="user-avatar" className="ArticleComment-avatar" />
              <div className="ArticleComment-meta">
                <span className="ArticleComment-nickname">{comment.nickname}</span>
                <span className="ArticleComment-time">{formatTime(comment.createdAt)}</span>
              </div>
              <div className="ArticleComment-actions">
                <img src="/images/icons8-love-96-13-1.png" alt="like" />
                <span>{comment.likes || 0}</span>
                <img src="/images/icons8-exclamation-mark-64-3.png" alt="report" />
              </div>
            </div>
            <p className="ArticleComment-content">{comment.content}</p>
          </div>
        ))}
      </div>

      <div className="ArticleComment-inputArea">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="請輸入留言……"
          maxLength={150}
        />
        <button onClick={handleSubmit}>
          <img src="/images/icons8-send-96-1.png" alt="send" />
        </button>
      </div>
    </div>
  );
};

export default ArticleComment;
