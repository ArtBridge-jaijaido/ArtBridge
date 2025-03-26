import { addComment, subscribeToComments, toggleCommentLike, toggleCommentReport } from "@/services/articleCommentService";
import { useState, useEffect } from "react";
import { formatTime } from "@/lib/functions";
import "./ArticleComment.css";
import { useSelector } from 'react-redux';
import { useToast } from "@/app/contexts/ToastContext.js";

const ArticleComment = ({ userUid, articleId }) => {
  const currentUser = useSelector((state) => state.user.user);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { addToast } = useToast();
  const [isAllAvatarsLoaded, setIsAllAvatarsLoaded] = useState(false);


  useEffect(() => {
    if (!userUid || !articleId) return;
  
    const unsubscribe = subscribeToComments(userUid, articleId, (fetchedComments) => {
      setComments(fetchedComments);
  
      // 預載所有頭像
      const loadPromises = fetchedComments.map(comment => {
        return new Promise(resolve => {
          const img = new Image();
          img.src = comment.avatar;
          img.onload = resolve;
          img.onerror = resolve; // 失敗也要 resolve，以避免卡住
        });
      });
  
      Promise.all(loadPromises).then(() => {
        setIsAllAvatarsLoaded(true);
      });
    }, currentUser?.uid);
  
    return () => unsubscribe();
  }, [userUid, articleId, currentUser]);

  // 按讚
  const handleLikeClick = async (commentId) => {
    if (!currentUser) {
      addToast("error", "請先登入才能按讚喔!");
      return;
    }

    try {
      await toggleCommentLike(userUid, articleId, commentId, currentUser.uid);
    } catch (error) {
      console.log(error);
      addToast("error", "按讚失敗，請稍後再試");
    }
  }

  // 檢舉
  const handleReportClick = async (commentId) => {
    if (!currentUser) {
      addToast("error", "請先登入才能檢舉喔!");
      return;
    }

    try {
      await toggleCommentReport(userUid, articleId, commentId, currentUser.uid);
    }catch (error){
      console.log(error);
      addToast("error", "檢舉失敗，請稍後再試");
    }
  }

  const handleSubmit = async () => {

    // 只有登入者可留言
    if (!currentUser) {
      addToast("error", "請先登入才能留言喔!");
      return;
    }

    if (!newComment.trim()) return;

    const avatarUrl = currentUser.profileAvatar || "/images/kv-min-4.png";

    // 預載圖片再送出留言
    const avatarImage = new Image();
    avatarImage.src = avatarUrl;

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
        {isAllAvatarsLoaded ? (
          comments.map((comment) => (
            <div key={comment.id} className="ArticleComment-item">
              <div className="ArticleComment-header">
                <img src={comment.avatar} alt="user-avatar" className="ArticleComment-avatar" />
                <div className="ArticleComment-meta">
                  <span className="ArticleComment-nickname">{comment.nickname}</span>
                  <span className="ArticleComment-time">{formatTime(comment.createdAt)}</span>
                </div>
                <div className="ArticleComment-actions">
                  <img
                    src={
                      comment.isLikedByCurrentUser
                        ? "/images/icons8-love-48-1.png"
                        : "/images/icons8-love-96-13-1.png"
                    }
                    alt="like"
                    onClick={() => handleLikeClick(comment.id)}
                  />
                  <span>{comment.likes || 0}</span>
                  <img src={comment.isReportedByCurrentUser?
                  "/images/exclamation-icon.png"
                  :"/images/icons8-exclamation-mark-64-3.png" 
                  }
                  alt="report" 
                  onClick={() => handleReportClick(comment.id)}
                  />
                </div>
              </div>
              <p className="ArticleComment-content">{comment.content}</p>
            </div>
          ))
        ) : (
          <p className="ArticleComment-loading">留言載入中...</p>
        )}
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
