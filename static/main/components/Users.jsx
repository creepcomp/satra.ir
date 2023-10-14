const Users = () => {
    const [users, setUsers] = React.useState([])
    const [user, setUser] = React.useState({})
    const [show, setShow] = React.useState(false)

    React.useEffect(() => {
        $.ajax({
            url: "/api/get_users",
            method: "POST",
            headers: {"X-CSRFToken": $.cookie("csrftoken")},
            success: (data) => {
                setUsers(data.users)
            }
        })
    }, [])

    const init = () => {
        setUser({})
    }

    const edit = (id) => {
        $.ajax({
            url: "/api/get_user",
            method: "POST",
            headers: {"X-CSRFToken": $.cookie("csrftoken")},
            data: JSON.stringify({id: id}),
            success: (data) => {
                setUser(data.user)
                setShow(true)
            }
        })
    }

    const _delete = (id) => {
        $.ajax({
            url: "/api/delete_user",
            method: "POST",
            headers: {"X-CSRFToken": $.cookie("csrftoken")},
            data: JSON.stringify({id: id}),
            success: (data) => {
                setUsers(data.users)
            }
        })
    }

    const save = () => {
        $.ajax({
            url: "/api/save_user",
            method: "POST",
            headers: {"X-CSRFToken": $.cookie("csrftoken")},
            data: JSON.stringify(user),
            success: (data) => {
                setUsers(data.users)
                setShow(false)
            }
        })
    }

    const changeHandler = (e) => {
        setUser({...user, [e.target.name]: e.target.value})
    }

    return (
        <>
            <table class="table align-middle">
                <thead>
                    <tr>
                        <td>#</td>
                        <td>نام کاربری</td>
                        <td>نام و نام خانوادگی</td>
                        <td>گروه ها</td>
                        <td>عملیات</td>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr>
                            <td>{index + 1}</td>
                            <td>{user.username}</td>
                            <td>{user.first_name} {user.last_name}</td>
                            <td>
                                {user.groups.map(group => <span class="bg-primary rounded m-1 p-1 text-light">{config.groups.find(x => x.id == group).name}</span>)}
                            </td>
                            <td>
                                <button class="btn btn-secondary m-1" onClick={() => edit(user.id)}>
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button class="btn btn-danger m-1" onClick={() => _delete(user.id)}>
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
                    <div class="row">
                        <div class="col-sm">
                            <label class="form-label" for="username">نام کاربری:</label>
                            <input class="form-control" type="text" name="username" id="username" value={user.username} onChange={changeHandler} />
                        </div>
                        <div class="col">
                            <label class="form-label" for="password">رمز عبور</label>
                            <input class="form-control" type="password" name="password" id="password" value={user.password} onChange={changeHandler} />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm">
                            <label class="form-label" for="first_name">نام:</label>
                            <input class="form-control" type="text" name="first_name" id="first_name" value={user.first_name} onChange={changeHandler} />
                        </div>
                        <div class="col">
                            <label class="form-label" for="last_name">نام خانوادگی:</label>
                            <input class="form-control" type="text" name="last_name" id="last_name" value={user.last_name} onChange={changeHandler} />
                        </div>
                    </div>
                    <label for="groups">گروه ها:</label>
                    <select class="form-select" name="groups" id="groups" value={user.groups} onChange={(e) => setUser({...user, [e.target.name]: $(e.target).val()})} multiple>
                        {config.groups.map((g) => <option value={g.id}>{g.name}</option>)}
                    </select>
                    <div class="alert alert-danger m-1 p-2">
                        <input class="form-check-input me-2" type="checkbox" name="is_superuser" id="is_superuser" checked={user.is_superuser} onChange={e => setUser({...user, is_superuser: e.target.checked})} />
                        <label class="form-check-label" for="is_superuser">کاربر فوق العاده (ادمین)</label>
                    </div>
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

ReactDOM.render(<Users />, document.getElementById("Users"))
