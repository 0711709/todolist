; (function () {
    'use strict';

    let form = document.getElementById("todo-form")
    let text = form.querySelector("input");
    let list = document.querySelector(".biao-todo-list");

    boot();

    function boot() {
        render();
        submit();
    }


    //打开页面时 => 渲染数据并绑定按钮事件
    function render() {
        //清空页面遗留数据,防止数据重复
        list.innerHTML = "";

        //首先获取后端数据
        api.get("todo/read", $ => {
            let data = $.data;
            //循环数组 获取数据
            if (data)
                data.forEach(it => {
                    let item = listRender(it);
                    list.appendChild(item);
                });
        })
    };

    function listRender(it) {

        let item = document.createElement("div");
        item.classList.add("todo-item");
        // list.appendChild(item);

        //渲染 input 
        let div = document.createElement("div");
        div.classList.add("checkbox")
        let input = document.createElement("input");
        input.type = "checkbox";
        input.checked = it.completed;
        item.appendChild(div);
        div.appendChild(input);
        //input 绑定事件
        input.addEventListener("click", e => {
            //获取数据
            let data = {};
            data.id = it.id;
            data.completed = e.target.checked
            api("todo/update", data);
        })

        //渲染 title
        let title = document.createElement("div");
        title.classList.add("title");
        title.innerText = it.title;
        title.$id = it.id;
        item.appendChild(title);

        //渲染 button
        //更新功能按钮
        let ops = document.createElement("div");
        ops.classList.add("ops");
        let updateButton = document.createElement("button");
        updateButton.classList.add("update");
        updateButton.innerText = "更新";
        ops.appendChild(updateButton);
        //绑定更新事件
        updateButton.addEventListener("click", e => {
            text.value = title.innerHTML;
            text.$id = it.id;
            text.$title = title;
        })

        //删除功能按钮
        let deleteButton = document.createElement("button");
        deleteButton.classList.add("delete");
        deleteButton.innerText = "删除";
        ops.appendChild(deleteButton);
        //绑定删除事件
        deleteButton.addEventListener("click", e => {
            item.remove();
            api("todo/delete", { id: it.id });
        })

        item.appendChild(ops);

        return item;
    };

    //input提交 => 创建或更新数据
    function submit() {
        form.addEventListener("submit", e => {
            e.preventDefault();

            //获取数据
            let data = {};
            data.title = text.value;
            data.completed = false;

            //提交数据
            //先判断是更新数据,还是创建数据
            if (!text.$id && text.$id !== 0) {
                api("todo/create", data, $ => {
                    //获取新数据的id
                    api.get("todo/read", $ => {
                        data.id = $.data[0].id;
                        console.log(data.id);
                    });
                    let item = listRender(data);
                    list.insertBefore(item, list.childNodes[0]);
                });
                form.reset();
            } else {
                api("todo/update", { id: text.$id, title: data.title });
                text.$title.innerHTML = data.title;
                form.reset();
                text.$id = null;
            }
        })
    };


    read();

    function read() {
        api('todo/read', null, data => {
            console.log(data);
        })
    }

})();