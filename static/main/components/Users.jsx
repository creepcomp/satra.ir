const Users = () => {
    const [users, setUsers] = React.useState([])
    const [user, setUser] = React.useState({})
    const [show, setShow] = React.useState(false)

    const update = () => {
        $.ajax({
            url: "/api/users/",
            success: data => setUsers(data)
        });
    }

    React.useEffect(update, []);

    const edit = url => {
        $.ajax({
            url: url,
            success: data => {
                setUser(data)
                setShow(true)
            }
        })
    }

    const _delete = url => {
        $.ajax({
            url: url,
            method: "DELETE",
            headers: {"X-CSRFToken": $.cookie("csrftoken")},
            success: update
        })
    }

    const save = () => {
        if (user.url) {
            $.ajax({
                url: user.url,
                method: "PUT",
                headers: {"X-CSRFToken": $.cookie("csrftoken")},
                contentType: "application/json",
                data: JSON.stringify(user),
                success: () => {
                    setUser({})
                    setShow(false)
                    update()
                }
            })
        } else {
            $.ajax({
                url: "/api/users/",
                method: "POST",
                headers: {"X-CSRFToken": $.cookie("csrftoken")},
                contentType: "application/json",
                data: JSON.stringify(user),
                success: () => {
                    setUser({})
                    setShow(false)
                    update()
                }
            })
        }
    }

    const changeHandler = e => {
        setUser({...user, [e.target.name]: e.target.value})
    }

    return (
        <>
            <table className="table align-middle">
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
                    {users.map(user => (
                        <tr>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.first_name} {user.last_name}</td>
                            <td>
                                {user.groups.map(url => <span className="bg-primary rounded m-1 p-1 text-light">{get_group(url).name}</span>)}
                            </td>
                            <td>
                                <button className="btn btn-secondary m-1" onClick={() => edit(user.url)}><i className="fa-solid fa-pen-to-square"></i></button>
                                <button className="btn btn-danger m-1" onClick={() => _delete(user.url)}><i className="fa-solid fa-xmark"></i></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ReactBootstrap.Modal show={show} size="lg">
                <div className="modal-header">
                    <h5>اضافه/ویرایش کردن</h5>
                    <button type="button" className="btn-close" onClick={() => setShow(false)}></button>
                </div>
                <div className="modal-body">
                    <div className="row">
                        <div className="col-sm">
                            <label className="form-label" for="username">نام کاربری:</label>
                            <input className="form-control" type="text" name="username" id="username" value={user.username} onChange={changeHandler} />
                        </div>
                        <div className="col">
                            <label className="form-label" for="password">رمز عبور</label>
                            <input className="form-control" type="password" name="password" id="password" value={user.password} onChange={changeHandler} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm">
                            <label className="form-label" for="first_name">نام:</label>
                            <input className="form-control" type="text" name="first_name" id="first_name" value={user.first_name} onChange={changeHandler} />
                        </div>
                        <div className="col">
                            <label className="form-label" for="last_name">نام خانوادگی:</label>
                            <input className="form-control" type="text" name="last_name" id="last_name" value={user.last_name} onChange={changeHandler} />
                        </div>
                    </div>
                    <label for="groups">گروه ها:</label>
                    <select className="form-select" name="groups" id="groups" value={user.groups} onChange={e => setUser({...user, [e.target.name]: $(e.target).val()})} multiple>
                        {groups.map(x => <option value={x.url}>{x.name}</option>)}
                    </select>
                    <div className="alert alert-danger m-1 p-2">
                        <input className="form-check-input me-2" type="checkbox" name="is_superuser" id="is_superuser" checked={user.is_superuser} onChange={e => setUser({...user, is_superuser: e.target.checked})} />
                        <label className="form-check-label" for="is_staff">کاربر فوق العاده (ادمین)</label>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-primary" onClick={save}>ذخیره</button>
                </div>
            </ReactBootstrap.Modal>
            <button className="btn btn-light position-absolute bottom-0 end-0 m-1 p-2" onClick={() => setShow(true)} ><i className="fa-solid fa-plus"></i></button>
        </>
    )
}

ReactDOM.render(<Users />, document.getElementById("app"))
