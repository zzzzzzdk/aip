import React, { useState, useRef, useCallback } from 'react'

// 用一段时间没有问题就把那个比对json存储的去掉了   到时候在重新梳理一下代码
const useEHistory = () => {

    const history = useRef([])
    const index = useRef(-1)
    const firstData = useRef(null)
    const preData = useRef(null)

    const [canUndo, setCanUndo] = useState(false)

    const [canRedo, setCanRedo] = useState(false)

    const compareObjects = (preData, nowData, path = '') => {
        let changes = [];
        try {
            Object.keys(nowData).forEach(key => {
                const new_path = path ? `${path}_._${key}` : key;
                if (!(key in preData)) {
                    changes.push({ action: 'add', path: new_path, value: nowData[key] });
                } else if (nowData[key] !== null && typeof nowData[key] === 'object' && typeof preData[key] === 'object') {
                    changes.push(...compareObjects(preData[key], nowData[key], new_path));
                } else if (preData[key] !== nowData[key]) {
                    changes.push({ action: 'modify', path: new_path, value: nowData[key] });
                }
            });

            Object.keys(preData).forEach(key => {
                if (!(key in nowData)) {
                    changes.push({ action: 'delete', path: path ? `${path}_._${key}` : key });
                }
            });
        } catch (error) {
            console.log(nowData, error)
        }
        return changes;
    }

    const applyChanges = (obj, changes) => {
        function setProperty(target, keyPath, value) {
            let keys = keyPath.split('_._');
            let lastKey = keys.pop();
            let current = keys.reduce((acc, key, i) => acc[key] = acc[key] || (keys[i + 1] !== undefined ? {} : []), target);
            current[lastKey] = value;
        }

        function deleteProperty(target, keyPath) {
            let keys = keyPath.split('_._');
            let lastKey = keys.pop();
            let current = keys.reduce((acc, key) => acc[key], target);
            if (lastKey in current) {
                delete current[lastKey];
            }
        }

        changes.forEach(change => {
            switch (change.action) {
                case 'add':
                case 'modify':
                    setProperty(obj, change.path, change.value);
                    break;
                case 'delete':
                    deleteProperty(obj, change.path);
                    break;
            }
        });
    }

    const copyObj = (data) => {
        return JSON.parse(JSON.stringify(data))
    }

    const clean = () => {
        history.current = []
        firstData.current = null
        preData.current = null
        index.current = -1
        setCanUndo(false)
        setCanRedo(false)
    }

    const init = (data) => {
        clean()
        firstData.current = copyObj(data)
        preData.current = firstData.current
        index.current = -1
        setCanUndo(false)
        setCanRedo(false)
    }

    const addHistory = (data, typeData) => {
        if (firstData.current === null) {
            init(data)
        }
        const _data = copyObj(data)
        const changeList = compareObjects(preData.current, _data);
        changeList.typeData = typeData
        preData.current = _data
        history.current = history.current.slice(0, index.current + 1)
        history.current.push(changeList)
        index.current = history.current.length - 1
        setCanUndo(true)
        setCanRedo(false)
    }

    const undo = () => {
        if (index.current === -1) {
            return null
        }

        let data = copyObj(firstData.current);

        let typeData = history.current[index.current].typeData

        for (let i = 0; i < history.current.length; i++) {
            if (i == index.current) {
                break;
            }
            applyChanges(data, history.current[i])
        }

        index.current--
        preData.current = data

        if (index.current === -1) {
            setCanUndo(false)
        } else {
            setCanUndo(true)
        }
        setCanRedo(true)

        return {
            json: data,
            typeData: typeData
        }
    }

    const redo = () => {
        if (index.current === history.current.length - 1) {
            return null
        }

        let data = copyObj(firstData.current);

        let typeData = history.current[index.current + 1].typeData

        for (let i = 0; i < history.current.length; i++) {
            applyChanges(data, history.current[i])
            if (i == index.current + 1) {
                break;
            }
        }

        index.current++
        preData.current = data

        if (index.current === history.current.length - 1) {
            setCanRedo(false)
        } else {
            setCanRedo(true)
        }

        setCanUndo(true)

        return {
            json: data,
            typeData: typeData
        }
    }

    const getVar = useCallback(() => {
        return {
            index,
            history
        }
    }, [])


    return {
        init,
        addHistory,
        undo, // 还原
        redo, // 重做
        canUndo,
        canRedo,
        clean,
        getVar,
    }
}


export default useEHistory









