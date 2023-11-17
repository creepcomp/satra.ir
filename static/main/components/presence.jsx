const WorkingGroupReport = () => {
    const input = React.useRef({})
    const [requests, setRequests] = React.useState([]);
    const [users, setUsers] = React.useState([]);

    React.useEffect(e => {
        setUsers(get_group_users("کارگروه"));
    }, []);

    React.useEffect(() => {
        $(input.current.from).pDatepicker({format: "YYYY-MM-DD", initialValue: false, initialValueType: "persian"})
        $(input.current.to).pDatepicker({format: "YYYY-MM-DD", initialValue: false, initialValueType: "persian"})
    })

    const report = e => {
        const params = {}
        if (input.current.from.value && input.current.to.value)
            params.working_group_at__range = [input.current.from.value, input.current.to.value];
        if (input.current.working_group_users.value)
            params.working_group_users__contains = $(input.current.working_group_users).val();
        $.ajax({
            url: "/api/requests/",
            data: JSON.stringify(params),
            success: data => setRequests(data)
        })
    }

    return (
        <div>
            <h2 className="text-center">کارگروه</h2>
            <table className="table text-center align-middle">
                <thead>
                    <tr>
                        <td>نام اثر</td>
                        <td>اعضا کارگروه</td>
                        <td>تاریخ کارگروه</td>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(r => (
                        <tr>
                            <td>
                                <a href={"/requests?id=" + r.id}>{r.name}</a>
                            </td>
                            <td>
                                <ul className="m-0">
                                    {r.working_group_users.map(id => <li>{get_user_from_id(id).first_name + " " + get_user_from_id(id).last_name}</li>)}
                                </ul>
                            </td>
                            <td>{r.working_group_at}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="row">
                <div className="col-sm">
                    <label htmlFor="start_date">تاریخ شروع:</label>
                    <input className="form-control" type="text" ref={e => input.current.from = e} />
                </div>
                <div className="col">
                    <label htmlFor="end_date">تاریخ پایان:</label>
                    <input className="form-control" type="text" ref={e => input.current.to = e} />
                </div>
            </div>
            <label htmlFor="working_group_users">اعضا کارگروه:</label>
            <select className="form-select" id="working_group_users" ref={e => input.current.working_group_users = e} multiple>
                <option value=""></option>
                {users.map(u => <option value={u.id}>{u.first_name} {u.last_name}</option>)}
            </select>
            <button className="btn btn-primary d-block mx-auto m-1" onClick={report}>گزارش</button>
        </div>
    )
}

const CouncilReport = () => {
    const input = React.useRef({})
    const [requests, setRequests] = React.useState([]);
    const [users, setUsers] = React.useState([]);

    React.useEffect(e => {
        setUsers(get_group_users("شورا"));
    }, []);

    React.useEffect(() => {
        $(input.current.from).pDatepicker({format: "YYYY-MM-DD", initialValue: false, initialValueType: "persian"})
        $(input.current.to).pDatepicker({format: "YYYY-MM-DD", initialValue: false, initialValueType: "persian"})
    })

    const report = e => {
        if (input.current.from.value && input.current.to.value)
            params.council_at__range = [input.current.from.value, input.current.to.value];
        if (input.current.council_users.value)
            params.council_users__contains = $(input.current.council_users).val();
        $.ajax({
            url: "/api/get_requests",
            method: "POST",
            headers: {"X-CSRFToken": $.cookie("csrftoken")},
            data: JSON.stringify({council_at__range: [input.current.from.value, input.current.to.value], council_users__contains: $(input.current.council_users).val()}),
            success: data => {
                setRequests(data.requests)
            }
        })
    }
    
    return (
        <div>
            <h2 className="text-center">شورا</h2>
            <table className="table text-center align-middle">
                <thead>
                    <tr>
                        <td>نام اثر</td>
                        <td>اعضا شورا</td>
                        <td>تاریخ شورا</td>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(r => (
                        <tr>
                            <td>
                                <a href={"/requests?id=" + r.id}>{r.name}</a>
                            </td>
                            <td>
                                <ul className="m-0">
                                    {r.council_users.map(u => <li>{get_user(u).first_name + " " + get_user(u).last_name}</li>)}
                                </ul>
                            </td>
                            <td>{r.council_at}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="row">
                <div className="col-sm">
                    <label htmlFor="start_date">تاریخ شروع:</label>
                    <input className="form-control" type="text" ref={e => input.current.from = e} />
                </div>
                <div className="col">
                    <label htmlFor="end_date">تاریخ پایان:</label>
                    <input className="form-control" type="text" ref={e => input.current.to = e} />
                </div>
            </div>
            <label htmlFor="council_users">اعضا شورا:</label>
            <select className="form-select" id="council_users" ref={e => input.current.council_users = e} multiple>
                <option value=""></option>
                {users.map(u => <option value={u.id}>{u.first_name} {u.last_name}</option>)}
            </select>
            <button className="btn btn-primary d-block mx-auto m-1" onClick={report}>گزارش</button>
        </div>
    )
}

const Presense = () => {
    return (
        <>
            <h1 className="text-center">حضور غیاب کارگروه / شورا</h1>
            <div className="row">
                <div className="col-sm">
                    <WorkingGroupReport />
                </div>
                <div className="col">
                    <CouncilReport />
                </div>
            </div>
        </>
    );
}

ReactDOM.render(<Presense />, document.getElementById("app"));
