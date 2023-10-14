const Groups = () => {
    const [groups, setgroups] = React.useState([])
    const [group, setgroup] = React.useState({})
    const [show, setShow] = React.useState(false)

    React.useEffect(() => {
        $.ajax({
            url: "/api/get_groups",
            method: "POST",
            headers: {"X-CSRFToken": $.cookie("csrftoken")},
            success: (data) => {
                setgroups(data.groups)
            }
        })
    }, [])

    const init = () => {
        setgroup({})
    }

    const edit = (id) => {
        $.ajax({
            url: "/api/get_groups",
            method: "POST",
            headers: {"X-CSRFToken": $.cookie("csrftoken")},
            data: JSON.stringify({id: id}),
            success: (data) => {
                setgroup(data.groups[0])
                setShow(true)
            }
        })
    }

    const _delete = (id) => {
        $.ajax({
            url: "/api/delete_group",
            method: "POST",
            headers: {"X-CSRFToken": $.cookie("csrftoken")},
            data: JSON.stringify({id: id}),
            success: (data) => {
                setgroups(data.groups)
            }
        })
    }

    const save = () => {
        $.ajax({
            url: "/api/save_group",
            method: "POST",
            headers: {"X-CSRFToken": $.cookie("csrftoken")},
            data: JSON.stringify(group),
            success: (data) => {
                setgroups(data.groups)
                setShow(false)
            }
        })
    }

    const changeHandler = (e) => {
        setgroup({...group, [e.target.name]: e.target.value})
    }

    return (
        <>
            <table class="table align-middle">
                <thead>
                    <tr>
                        <td>#</td>
                        <td>نام کاربری</td>
                        <td>عملیات</td>
                    </tr>
                </thead>
                <tbody>
                    {groups.map((group, index) => (
                        <tr>
                            <td>{index + 1}</td>
                            <td>{group.name}</td>
                            <td>
                                <button class="btn btn-secondary m-1" onClick={() => edit(group.id)}>
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button class="btn btn-danger m-1" onClick={() => _delete(group.id)}>
                                    <i class="fa-solid fa-xmark"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ReactBootstrap.Modal show={show} size="lg">
                <div class="modal-header">
                    <h5>اضافه/ویرایش کردن</h5>
                    <button type="button" class="btn-close" onClick={() => setShow(false)}></button>
                </div>
                <div class="modal-body">
                    <label class="form-label" for="name">نام گروه:</label>
                    <input class="form-control" type="text" name="name" id="name" value={group.name} onChange={changeHandler} />
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onClick={save}>ذخیره</button>
                </div>
            </ReactBootstrap.Modal>
            <button class="btn btn-light position-absolute bottom-0 end-0 m-1 p-2" onClick={() => {setShow(true); init()}} >
                <i class="fa-solid fa-plus"></i>
            </button>
        </>
    )
}

ReactDOM.render(<Groups />, document.getElementById("Groups"))
