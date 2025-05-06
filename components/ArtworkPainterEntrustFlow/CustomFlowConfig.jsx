"use client";

import React, { useState } from "react";
import "./CustomFlowConfig.css";
import { useToast } from "@/app/contexts/ToastContext.js";

const CustomFlowConfig = () => {
  const { addToast } = useToast(); // ✅ 正確 hook 使用位置

  const [milestones, setMilestones] = useState([
    { label: "0% 支付款項", percent: 0 },
    { label: "100% 完稿", percent: 100 }
  ]);

  const [inputs, setInputs] = useState([
    { percent: "", name: "" },
    { percent: "", name: "" },
    { percent: "", name: "" }
  ]);

  const handleAddInput = () => {
    setInputs([...inputs, { percent: "", name: "" }]);
  };

  const syncMilestonesFromInputs = (inputList) => {
    const baseMilestones = [
      { label: "0% 支付款項", percent: 0 },
      { label: "100% 完稿", percent: 100 }
    ];
  
    const percentSet = new Set([0, 100]);
    const intermediateMilestones = [];
  
    for (let i = 0; i < inputList.length; i++) {
      const input = inputList[i];
      const percentNum = parseInt(input.percent);
      const name = input.name?.trim?.();
  
      if (
        isNaN(percentNum) ||
        percentNum <= 0 ||
        percentNum >= 100 ||
        percentSet.has(percentNum) ||
        !name
      ) {
        continue;
      }
  
      percentSet.add(percentNum);
      intermediateMilestones.push({
        label: `${percentNum}% ${name}`,
        percent: percentNum
      });
    }
  
    const allMilestones = [...baseMilestones, ...intermediateMilestones];
  
    const sorted = allMilestones
      .filter((m, i, self) => i === self.findIndex((t) => t.label === m.label))
      .sort((a, b) => a.percent - b.percent)
      .map((m, i) => ({ ...m, id: i }));
  
    setMilestones(sorted);
  };
  

  const handleChange = (index, field, value) => {
    const newInputs = [...inputs];
    newInputs[index][field] = value;
    setInputs(newInputs);
    syncMilestonesFromInputs(newInputs);
  };
  
  
  
  const handleDeleteInput = (index) => {
    const newInputs = inputs.filter((_, i) => i !== index);
    setInputs(newInputs);
    syncMilestonesFromInputs(newInputs);
  };
  
  

  const handleSave = async () => {
    const baseMilestones = [
      { label: "0% 支付款項", percent: 0 },
      { label: "100% 完稿", percent: 100 }
    ];
  
    const percentSet = new Set([0, 100]);
    const intermediateMilestones = [];
  
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const percentNum = parseInt(input.percent);
      const name = input.name.trim();
  
      if (isNaN(percentNum)) {
        return addToast("error", `第 ${i + 1} 項流程的百分比必須是數字`);
      }
      if (percentNum <= 0 || percentNum >= 100) {
        return addToast("error", `第 ${i + 1} 項流程的百分比必須介於 1% ~ 99% 之間`);
      }
      if (percentSet.has(percentNum)) {
        return addToast("error", `第 ${i + 1} 項流程的百分比重複，請修改`);
      }
      if (!name) {
        return addToast("error", `第 ${i + 1} 項流程請輸入名稱`);
      }
  
      percentSet.add(percentNum);
      intermediateMilestones.push({
        label: `${percentNum}% ${name}`,
        percent: percentNum
      });
    }
  
    const allMilestones = [...baseMilestones, ...intermediateMilestones];
  
    const sorted = allMilestones
      .filter((m, i, self) => i === self.findIndex((t) => t.label === m.label))
      .sort((a, b) => a.percent - b.percent)
      .map((m, i) => ({ ...m, id: i }));
  
    try {
      console.log("送出到資料庫的資料：", sorted);
      // TODO: 這裡替換成實際資料庫 API 提交
      addToast("success", "流程已送出至資料庫");
    } catch (err) {
      addToast("error", "儲存失敗，請稍後再試");
    }
  };
  

  return (
    <div className="customFlowConfig-wrapper">
      <div className="customFlowConfig-container">
        <div className="customFlowConfig-list">
          {milestones.map((m, index) => (
            <React.Fragment key={index}>
              <div className="customFlowConfig-item">
                <div className="customFlowConfig-circle" />
                <div className="customFlowConfig-percent">{m.label.split(" ")[0]}</div>
                <div className="customFlowConfig-label">{m.label.split(" ")[1]}</div>
              </div>
              {index !== milestones.length - 1 && (
                <div className="customFlowConfig-connector-line" />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="customFlowConfig-divider" />

        <div className="customFlowConfig-add-form">
          <button className="customFlowConfig-add-button" onClick={handleAddInput}>
            <img src="/images/icons8-add-96-2.png" alt="addIcon" className="customFlowConfig-add-icon" />
            <span className="customFlowConfig-add-text">新增流程</span>
          </button>

          {inputs.map((input, index) => (
            <div className="customFlowConfig-input-row" key={index}>
              <input
                type="number"
                className="customFlowConfig-input-percent"
                value={input.percent}
                onChange={(e) => handleChange(index, "percent", e.target.value)}
              />
              <span className="customFlowConfig-percent-sign">%</span>
              <input
                type="text"
                className="customFlowConfig-input-name"
                placeholder="請輸入名稱"
                value={input.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />
              <button
                className="customFlowConfig-delete-button"
                onClick={() => handleDeleteInput(index)}
              >
                刪除
              </button>
            </div>
          ))}

          <button className="customFlowConfig-save-button" onClick={handleSave}>
            儲存
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomFlowConfig;
