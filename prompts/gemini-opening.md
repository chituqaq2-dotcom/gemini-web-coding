# Gemini 开场模板与常用短句

## 通用开场（项目有 AGENTS.md / docs）
```
@runabout Work only in /workspace/<项目路径>. First read AGENTS.md and docs/README.md, then tell me your plan before editing. Create a branch before editing. Reply in Chinese.
```

## 通用开场（项目没有交接文档）
```
@runabout Work only in /workspace/<项目路径>. First read NOTES.md and the README, then tell me your plan before editing. Reply in Chinese.
```

## 第一次进一个项目：建 NOTES.md
```
@runabout Read /workspace/<项目路径>, then create NOTES.md there summarizing the stack, current state and next steps. Reply in Chinese.
```

## 对话结束前
```
Update NOTES.md with what changed and next steps.
```

## 常用短句
- 只读：`READ-ONLY: do not delete, move, reset, clean or modify anything.`
- 慢命令：`Run it in the background and read the output when done.`
- 改完给我看：`Show me git diff before committing.`
- 小步：`Make the smallest change that works, then run the tests.`
- 不要瞎猜：`If unsure, say so instead of guessing.`
- 连通测试：`@runabout list the top-level folders in /workspace. Don't change anything.`
