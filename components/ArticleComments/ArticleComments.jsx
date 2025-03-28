import { addComment, subscribeToComments, toggleCommentLike, toggleCommentReport, deleteComment } from "@/services/articleCommentService";
import { useState, useEffect } from "react";
import { formatTime } from "@/lib/functions";
import "./ArticleComment.css";
import { useSelector } from 'react-redux';
import { useToast } from "@/app/contexts/ToastContext.js";
import { usePathname } from "next/navigation";


const ArticleComment = ({ userUid, articleId }) => {
  const currentUser = useSelector((state) => state.user.user);
  const pathname = usePathname();
  const isInPainterArticlePage = pathname.includes("artworkPainterArticle");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { addToast } = useToast();
  const allUsers = useSelector((state) => state.user.allUsers);
  const [isCommentsFetched, setIsCommentsFetched] = useState(false);
  const [isAllAvatarsLoaded, setIsAllAvatarsLoaded] = useState(false);

  // article 的作者是 currentUser 本人, 且頁面是在artworkPainterArticle
  const isArticleOwner = userUid === currentUser?.uid && isInPainterArticlePage;

  useEffect(() => {
    if (!userUid || !articleId) return;

    const unsubscribe = subscribeToComments(userUid, articleId, (fetchedComments) => {
      setComments(fetchedComments);
      setIsCommentsFetched(true);

      // 預載所有頭像
      const loadPromises = fetchedComments.map(comment => {
        return new Promise(resolve => {
          const img = new Image();
          img.src = comment.avatar;
          img.onload = resolve;
          img.onerror = resolve;
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
  };

  // 檢舉
  const handleReportClick = async (commentId) => {
   

    if (!currentUser) {
      addToast("error", "請先登入才能檢舉喔!");
      return;
    }

    try {
      await toggleCommentReport(userUid, articleId, commentId, currentUser.uid);
    } catch (error) {
      console.log(error);
      addToast("error", "檢舉失敗，請稍後再試");
    }
  };


  // 刪除
  const handleDeleteClick = async (commentId) => {
    const confirmDelete = window.confirm("確定要刪除這則留言嗎？");
    if (!confirmDelete) return;

    try {
      const result = await deleteComment(userUid, articleId, commentId);
      if (result.success) {
        addToast("success", "留言已成功刪除！");
        // 不需要手動更新 comments，因為 `subscribeToComments` 已經會自動處理畫面更新
      } else {
        addToast("error", "刪除留言失敗，請稍後再試");
      }
    } catch (error) {
      console.error("刪除留言發生錯誤", error);
      addToast("error", "發生錯誤，請稍後再試");
    }
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      addToast("error", "請先登入才能留言喔!");
      return;
    }

    if (!newComment.trim()) return;


    await addComment(userUid, articleId, {
      content: newComment,
      userUid: currentUser.uid,
    });

    setNewComment("");
  };

  const isLoaded = isCommentsFetched && isAllAvatarsLoaded;

  if (!isLoaded) {
    return <p className="ArticleComment-loading">留言載入中...</p>;
  }


  return (
    <div className="ArticleComment-section">
      <div className="ArticleComment-list">
        {comments.map((comment) => {
          const user = allUsers[comment.userUid];
          return (
            <div key={comment.id} className="ArticleComment-item">
              <div className="ArticleComment-header">
                <img
                  src={user?.profileAvatar || "/images/kv-min-4.png"}
                  alt="user-avatar"
                  className="ArticleComment-avatar"
                />
                <div className="ArticleComment-meta">
                  <span className="ArticleComment-nickname">{user?.nickname || "使用者名稱"}</span>
                  <span className="ArticleComment-time">{formatTime(comment.createdAt)}</span>
                </div>
                <div className="ArticleComment-actions">
                  <img
                    src={comment.isLikedByCurrentUser ? "/images/icons8-love-48-1.png" : "/images/icons8-love-96-13-1.png"}
                    alt="like"
                    onClick={() => handleLikeClick(comment.id)}
                  />
                  <span>{comment.likes || 0}</span>
                  {isArticleOwner && (
                    <button className="ArticleComment-deleteBtn" onClick={() => handleDeleteClick(comment.id)}>刪除</button>
                  )}
                  <img
                    src={comment.isReportedByCurrentUser ? "/images/exclamation-icon.png" : "/images/icons8-exclamation-mark-64-3.png"}
                    alt="report"
                    onClick={() => handleReportClick(comment.id)}
                  />
                </div>
              </div>
              <p className="ArticleComment-content">{comment.content}</p>
            </div>
          );
        })}
      </div>

      {!isArticleOwner && (
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
      )}
    </div>
  );
};

export default ArticleComment;
