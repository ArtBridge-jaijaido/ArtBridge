"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updatePainterArticle } from "@/app/redux/feature/painterArticleSlice";
import { updateArticleData } from "@/services/artworkArticleService";
import { artMarketCategory, artMarketStyle } from '@/lib/artworkDropdownOptions.js';
import { useToast } from "@/app/contexts/ToastContext.js";
import LoadingButton from "@/components/LoadingButton/LoadingButton.jsx";
import ArticleComment from '@/components/ArticleComments/ArticleComments.jsx';
import "./ModelImageArticleTab.css";



const ModelImageArticleTabs = ({ data }) => {

  if (!data) return null;

  const tabs = [
    { label: "內文", content: { articleId: data?.articleId, innerContext: data?.innerContext, innerContextTitle: data?.title } },
    {
      label: "留言板",
      content: data?.articleId && data?.userUid? (
        <ArticleComment
          articleId={data.articleId}
          userUid={data.userUid}
         
        />
      ) : <p>留言板載入中...</p>,
    },
    { label: "圖片資訊", content: { imageSource: data?.imageSource || "無", imageReleaseDate: data?.createdAt, imageCateorgy: data?.selectedStyles } }
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].label); // 預設選中的 tab 為第一個
  const dispatch = useDispatch();
  const innerContextData = tabs.find(tab => tab.label === "內文")?.content;
  const [editedText, setEditedText] = useState(innerContextData?.innerContext || "");
  const [originalText, setOriginalText] = useState(innerContextData?.innerContext || "");
  const [isEditing, setIsEditing] = useState(false);  // 控制是否編輯中
  const categoryRef = useRef(null);
  const styleRef = useRef(null);
  const filteredStyles = artMarketStyle.filter(option => option !== "全部");
  const filteredCategories = artMarketCategory.filter(option => option !== "全部");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isStyleOpen, setIsStyleOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (data) {
      setFormData({
        imageSource: data.imageSource || "",
        selectedCategory: data.selectedCategory || "",
        selectedStyles: data.selectedStyles || [],
      });
    }
  }, [data]);


  const [formData, setFormData] = useState({
    imageSource: "",
    selectedCategory: "",
    selectedStyles: [],
  });

  // 儲存編輯後的 innerContext

  const handleInnerContextSave = async () => {
    try {
      //  呼叫 Firebase API 更新文章 `innerContext`
      await updateArticleData({
        userUid: data.userUid,
        articleId: data.articleId,
        updateData: { innerContext: editedText },
      });


      //  更新 Redux store（確保前端同步更新）
      dispatch(updatePainterArticle({
        articleId: data.articleId,
        innerContext: editedText,
      }));

      setIsEditing(false); // 關閉編輯模式
    } catch (error) {
      console.error("更新失敗", error);
    }
  };

  // 類別選擇（單選）
  const handleCategorySelect = (option) => {
    setFormData(prev => ({
      ...prev,
      selectedCategory: prev.selectedCategory === option ? "" : option
    }));
    setIsCategoryOpen(false);
  };

  // 風格選擇（最多 3 項）
  const handleStyleSelect = (event, option) => {
    event.stopPropagation();

    if (formData.selectedStyles.length === 3 && !formData.selectedStyles.includes(option)) {
      addToast("error", "最多只能選擇 3 項風格");
      return;
    }

    setFormData(prev => {
      let updatedStyles;
      if (prev.selectedStyles.includes(option)) {
        updatedStyles = prev.selectedStyles.filter(item => item !== option);
      } else if (prev.selectedStyles.length < 3) {
        updatedStyles = [...prev.selectedStyles, option];
      } else {

        return prev; // 不要變更 state
      }
      return { ...prev, selectedStyles: updatedStyles };
    });
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      // 如果點擊的地方不在 styleRef 或 categoryRef 內，就關閉選單
      if (styleRef.current && !styleRef.current.contains(event.target)) {
        setIsStyleOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const validationForm = () =>{
    if (!formData.imageSource) {
      addToast("error", "請輸入圖片出處");
      return false;
    }
    if (!formData.selectedCategory) {
      addToast("error", "請選擇分類");
      return false;
    }
    if (formData.selectedStyles.length === 0) {
      addToast("error", "請選擇風格");
      return false;
    }
    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validationForm ()) return;
    setIsSubmitting(true);
    console.log("送出更新的 formData:", formData);

    try {
      const response = await updateArticleData({
        userUid: data.userUid,
        articleId: data.articleId,
        updateData: {
          imageSource: formData.imageSource,
          selectedCategory: formData.selectedCategory,
          selectedStyles: formData.selectedStyles,
        }
      });

      if (response.success) {
        addToast("success", "文章資訊已成功更新！");

        // 更新 Redux store（如果 Redux 內有這筆資料）
        dispatch(updatePainterArticle({
          articleId: data.articleId,
          imageSource: formData.imageSource,
          selectedCategory: formData.selectedCategory,
          selectedStyles: formData.selectedStyles,
        }));
      } else {
        addToast("error", "更新失敗，請稍後再試。");
      }
    } catch (error) {
      console.error("更新失敗:", error);
      addToast("error", "更新失敗，請稍後再試。");
    } finally {
      setIsSubmitting(false);
    }
  };




  return (
    <div className="ModelImage-article-tabs-container">
      {/* 選項按鈕 */}
      <div className="ModelImage-article-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`ModelImage-article-tab ${activeTab === tab.label ? "active" : ""}`}
            onClick={() => setActiveTab(tab.label)} // 切換選項
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 對應內容 */}
      <div className="ModelImage-article-tab-content">
        {tabs.map((tab) => {
          if (activeTab === tab.label) {
            switch (tab.label) {
              case "內文":
                return (
                  <div key={tab.label} className="ModelImage-article-tab-panel ModelImage-article-tab-panel-innerContext">
                    <h1>{tab.content.innerContextTitle}</h1>
                    <div className="ModelImage-article-tab-innerContext-container">
                      {isEditing ? (
                        <div className="ModelImage-article-tab-edit-mode-container">
                          {/* 🔥 文字輸入框 */}
                          <textarea
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                            maxLength={1000}
                            className="ModelImage-article-tab-edit-textarea"
                          />


                          <div className="ModelImage-article-tab-footer">
                            {/* 🔥 字數計數器 */}
                            <div className="ModelImage-article-tab-char-count">{editedText.length}/1000字</div>

                            {/* 🔥 按鈕區域 */}
                            <div className="ModelImage-article-tab-button-container">
                              <button className="ModelImage-article-tab-cancel-btn" onClick={() => {
                                setEditedText(originalText); // 恢復原內容
                                setIsEditing(false); // 關閉編輯模式
                              }}>取消</button>

                              <button className="ModelImage-article-tab-save-btn" onClick={handleInnerContextSave}>儲存</button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p>
                          {editedText}
                        </p>
                      )}

                      {/* ✏️ 編輯按鈕 */}
                      {!isEditing && (
                        <div
                          className="ModelImage-article-tab-innerContext-editBtn"
                          onClick={() => {
                            setOriginalText(editedText); // 存原始內容，點「取消」可恢復
                            setIsEditing(true);
                          }}
                        >
                          <img src="/images/icons8-create-52-2.png" alt="editIcon" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              case "留言板":
                return (
                  <div key={tab.label} className="ModelImage-article-tab-panel">
                    {tab.content}
                  </div>
                );
              case "圖片資訊":
                return (
                  <div key={tab.label} className="ModelImage-article-tab-panel ModelImage-article-tab-panel-imageInfo">
                    {/* 圖片出處 */}
                    <div className="ModelImage-article-tab-field">
                      <label htmlFor="imageSource">圖片出處</label>
                      <input
                        id="ModelImage-article-tab-imageSource"
                        type="text"
                        placeholder="請輸入圖片出處"
                        value={formData.imageSource}
                        onChange={(e) => setFormData(prev => ({ ...prev, imageSource: e.target.value }))}
                        className="ModelImage-article-tab-input"
                        maxLength={50}
                      />
                    </div>

                    {/* 類別選擇 */}
                    <div className="ModelImage-article-tab-dropdowns">
                      <div className="ModelImage-article-tab-category-width" ref={categoryRef}>
                        <div className="ModelImage-article-tab-dropdown-container">
                          <div
                            id="ModelImage-article-tab-dropdown-btn"
                            className={`ModelImage-article-tab-dropdown ${isCategoryOpen ? "open" : ""}`}
                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                          >
                            類別選擇
                            {isCategoryOpen && (
                              <ul className="ModelImage-article-tab-dropdown-options">
                                {filteredCategories.map((option, index) => (
                                  <li key={index} className="ModelImage-article-tab-dropdown-option">
                                    <input
                                      type="checkbox"
                                      checked={formData.selectedCategory === option}
                                      onClick={(e) => e.stopPropagation()}
                                      onChange={() => handleCategorySelect(option)}
                                    />
                                    {option}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <span className="ModelImage-article-tab-max-selection">(最多1項)</span>
                        </div>
                        <input
                          type="text"
                          value={formData.selectedCategory || "請選擇分類"}
                          readOnly
                          className={`ModelImage-article-tab-input-box ${formData.selectedCategory ? "black-text" : "gray-text"}`}
                        />
                      </div>
                    </div>

                    {/* 風格選擇 */}
                    <div className="ModelImage-article-tab-dropdowns">
                      <div className="ModelImage-article-tab-style-width" ref={styleRef}>
                        <div className="ModelImage-article-tab-dropdown-container">
                          <div
                            id="ModelImage-article-tab-dropdown-btn"
                            className={`ModelImage-article-tab-dropdown ${isStyleOpen ? "open" : ""}`}
                            onClick={() => setIsStyleOpen(!isStyleOpen)}
                          >
                            風格選擇
                            {isStyleOpen && (
                              <ul className="ModelImage-article-tab-dropdown-options">
                                {filteredStyles.map((option, index) => (
                                  <li key={index} className="ModelImage-article-tab-dropdown-option">
                                    <input
                                      type="checkbox"
                                      checked={formData.selectedStyles.includes(option)}
                                      onClick={(e) => e.stopPropagation()}
                                      onChange={(e) => handleStyleSelect(e, option)}
                                    />
                                    {option}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <span className="ModelImage-article-tab-max-selection">(最多3項)</span>
                        </div>
                        <input
                          type="text"
                          value={formData.selectedStyles.length > 0 ? formData.selectedStyles.join("、") : "風格1、風格2、風格3"}
                          readOnly
                          className={`ModelImage-article-tab-input-box ${formData.selectedStyles.length > 0 ? "black-text" : "gray-text"}`}
                        />
                      </div>
                    </div>

                    {/* 儲存按鈕 */}
                    <div className="ModelImage-article-tab-save-container">
                      <LoadingButton isLoading={isSubmitting} onClick={handleSubmit} loadingText={"儲存中"} >儲存</LoadingButton>
                    </div>
                  </div>
                );
              default:
                return null;
            }
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default ModelImageArticleTabs;
