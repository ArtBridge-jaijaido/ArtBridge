"use client";
import React, { useState, useEffect } from "react";
import "./CustomFlowConfig.css";
import { useToast } from "@/app/contexts/ToastContext.js";
import {updateUserData} from "@/services/userService.js";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateUser } from "@/app/redux/feature/userSlice.js";
import LoadingButton from "@/components/LoadingButton/LoadingButton.jsx"; 
import PainterMilestoneProgress from "@/components/PainterMilestoneProgress/PainterMilestoneProgress.jsx";


const CustomFlowConfig = () => {
  const { addToast } = useToast();
  const user = useSelector((state) => state.user.user);
  const [isSaving, setIsSaving] = useState(false);  
  const dispatch = useDispatch();

  const baseMilestones = [
    { label: "0% 支付款項", percent: 0, status:"等待中" },
    { label: "100% 完稿", percent: 100, status:"等待中" }
  ];

  const extractInputsFromMilestones = (milestones) =>
    milestones
      .filter((m) => m.percent !== 0 && m.percent !== 100)
      .map((m) => {
        const percent = m.percent ?? parseInt(m.label.split("%")[0]);
        const name = m.label.split("%")[1]?.trim?.() ?? "";
        return { percent: percent.toString(), name };
      });

  const [inputs, setInputs] = useState([]);
  const [milestones, setMilestones] = useState([]);

  // 初始化流程設定（從 user.painterMilestone）
  useEffect(() => {
    if (!user?.painterMilestone) return;
    const userMilestones = user.painterMilestone;
    const intermediate = extractInputsFromMilestones(userMilestones).map((input) => ({
      label: `${input.percent}% ${input.name}`,
      percent: parseInt(input.percent)
    }));
    setInputs(extractInputsFromMilestones(userMilestones));
    setMilestones([...baseMilestones, ...intermediate].sort((a, b) => a.percent - b.percent));
  }, [user]);

  const handleAddInput = () => {
    if (inputs.length >= 3) {
      addToast("error", "最多只能新增三個流程階段");
      return;
    }
    setInputs([...inputs, { percent: "", name: "" }]);
  };

  const applyOfficialFlow = () => {
    const officialInputs = [
      { percent: "20", name: "草稿" , status:"等待中"},
      { percent: "30", name: "線稿" , status:"等待中"},
      { percent: "60", name: "上色", status:"等待中" }
    ];
    setInputs(officialInputs);
    syncMilestonesFromInputs(officialInputs);
  
  };

  const syncMilestonesFromInputs = (inputList) => {
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
        percentNum % 10 !== 0 ||
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
  };

  const validatePercent = (index) => {
    const percentNum = parseInt(inputs[index].percent);
    if (isNaN(percentNum) || percentNum % 10 !== 0) {
      addToast("error", `第 ${index + 1} 項流程的百分比必須是 10% 的倍數`);
      return;
    }
    syncMilestonesFromInputs(inputs);
  };

  const validateName = (index) => {
    const name = inputs[index].name;
    if (name.length > 5) {
      const newInputs = [...inputs];
      newInputs[index].name = name.slice(0, 5);
      setInputs(newInputs);
      addToast("error", `第 ${index + 1} 項流程名稱最多只能輸入 5 個字`);
      syncMilestonesFromInputs(newInputs);
    } else {
      syncMilestonesFromInputs(inputs);
    }
  };

  const handleDeleteInput = (index) => {
    const newInputs = inputs.filter((_, i) => i !== index);
    setInputs(newInputs);
    syncMilestonesFromInputs(newInputs);
  };

  const handleSave = async () => {
    const percentSet = new Set([0, 100]);
    const intermediateMilestones = [];
    setIsSaving(true); 

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const percentNum = parseInt(input.percent);
      const name = input.name.trim();

      if (isNaN(percentNum)) return addToast("error", `第 ${i + 1} 項流程的百分比必須是數字`);
      if (percentNum <= 0 || percentNum >= 100)
        return addToast("error", `第 ${i + 1} 項流程的百分比必須介於 1% ~ 99%`);
      if (percentNum % 10 !== 0)
        return addToast("error", `第 ${i + 1} 項流程的百分比必須是 10% 的倍數`);
      if (percentSet.has(percentNum))
        return addToast("error", `第 ${i + 1} 項流程的百分比重複`);
      if (!name) return addToast("error", `第 ${i + 1} 項流程請輸入名稱`);

      percentSet.add(percentNum);
      intermediateMilestones.push({
        label: `${percentNum}% ${name}`,
        percent: percentNum
      });
    }

    const painterMilestoneSorted = [...baseMilestones, ...intermediateMilestones]
    .sort((a, b) => a.percent - b.percent)
    .map((m, i) => ({ ...m, id: i }));

  try {
    const res = await updateUserData(user.uid, {
      painterMilestone: painterMilestoneSorted
    });

    if (res.success) {
      dispatch(updateUser({ painterMilestone: painterMilestoneSorted })); 
      addToast("success", "繪師委託流程已更新");
    } else {
      addToast("error", res.message);
    }
  } catch (err) {
    addToast("error", "更新失敗，請稍後再試");
  }finally{
    setIsSaving(false); 
  }
};

  return (
    <div className="customFlowConfig-wrapper">
      <div className="customFlowConfig-container">
        {/* 流程預覽 */}
        {/* <div className="customFlowConfig-list">
          {milestones.map((m, index) => (
            <React.Fragment key={index}>
              <div className="customFlowConfig-item">
                <div className="customFlowConfig-circle" />
                <div className="customFlowConfig-percent">{m.label.split(" ")[0]}</div>
                <div className="customFlowConfig-label">{m.label.split(" ")[1]}</div>
              </div>
              {index !== milestones.length - 1 && <div className="customFlowConfig-connector-line" />}
            </React.Fragment>
          ))}
        </div> */}
     <div className="customFlowConfig-painterMilestoneProgress-container">
        <PainterMilestoneProgress
          milestones={milestones.map((m) => ({
            ...m,
            id: `${m.percent}-${m.label}`,
          }))}
        />
      </div>

        <div className="customFlowConfig-divider" />

        {/* 編輯流程 */}
        <div className="customFlowConfig-add-form">
          <div style={{ display: "flex", alignItems: "center", gap: "61px" }}>
            <button className="customFlowConfig-add-button" onClick={handleAddInput}>
              <img src="/images/icons8-add-96-2.png" alt="addIcon" className="customFlowConfig-add-icon" />
              <span className="customFlowConfig-add-text">新增流程</span>
            </button>

            <button className="customFlowConfig-apply-official-button" onClick={applyOfficialFlow}>
              套用官方流程
            </button>
          </div>

          {inputs.map((input, index) => (
            <div className="customFlowConfig-input-row" key={index}>
              <div className="customFlowConfig-input-group">
                <input
                  type="number"
                  className="customFlowConfig-input-percent"
                  value={input.percent}
                  onChange={(e) => handleChange(index, "percent", e.target.value)}
                  onBlur={() => validatePercent(index)}
                  onKeyDown={(e) => e.key === "Enter" && validatePercent(index)}
                />
                <span className="customFlowConfig-percent-sign">%</span>
                <input
                  type="text"
                  className="customFlowConfig-input-name"
                  placeholder="請輸入名稱"
                  value={input.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                  onBlur={() => validateName(index)}
                  onKeyDown={(e) => e.key === "Enter" && validateName(index)}
                />
              </div>
              <button className="customFlowConfig-delete-button" onClick={() => handleDeleteInput(index)}>
                刪除
              </button>
            </div>
          ))}

          <LoadingButton
            isLoading={isSaving}
            onClick={handleSave}
            loadingText="儲存中..."
            className="customFlowConfig-save-button"
          >
            儲存
          </LoadingButton>

         
        </div>
      </div>
    </div>
  );
};

export default CustomFlowConfig;
