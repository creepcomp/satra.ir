const Requests = () => {
    const queryParameters = new URLSearchParams(window.location.search);
    const [requests, setRequests] = React.useState([])
    const [show, setShow] = React.useState(false)
    const [request, setRequest] = React.useState({})

    const update = () => {
        $.ajax({
            url: "/api/requests/",
            success: data => {
                $("#table").DataTable().destroy();
                setRequests(data);
                $("#table").DataTable({
                    autoWidth: false,
                    language: {
                        url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/fa.json',
                    },
                    dom: 'Bfrtip',
                    buttons: [
                        {
                            extend: "csv",
                            text: "دریافت اکسل (csv)"
                        },
                        {
                            extend: "print",
                            customize: doc => {
                                $(doc.document.body).css('direction', 'rtl');
                            }
                        }, "copy"
                    ]
                });
            }
        });
    }

    React.useEffect(() => {
        update()
        const evaluation_id = queryParameters.get("id")
        if (evaluation_id) edit(evaluation_id)
    }, [])

    React.useEffect(() => {
        $("#created_at").pDatepicker({format: "YYYY-MM-DD", initialValue: false, initialValueType: "persian"})
        $("#working_group_at").pDatepicker({format: "YYYY-MM-DD", initialValue: false, initialValueType: "persian"})
        $("#council_at").pDatepicker({format: "YYYY-MM-DD", initialValue: false, initialValueType: "persian"})
    })

    const filter = () => {
        delete request.created_by
        $.ajax({
            url: "/api/requests/",
            data: JSON.stringify(request, (k, v) => v ? v : undefined),
            success: data => update(data)
        })
    }

    const edit = id => {
        $.ajax({
            url: `/api/requests/${id}/`,
            success: data => {setRequest(data); setShow(true)}
        })
    }

    const _delete = id => {
        $.ajax({
            url: `/api/requests/${id}/`,
            method: "DELETE",
            headers: {"X-CSRFToken": $.cookie("csrftoken")},
            success: update
        })
    }

    const save = () => {
        if (request.id) {
            $.ajax({
                url: `/api/requests/${request.id}/`,
                method: "PUT",
                headers: {"X-CSRFToken": $.cookie("csrftoken")},
                contentType: "application/json",
                data: JSON.stringify(request),
                success: () => {
                    setRequest({})
                    setShow(false)
                    update()
                },
                error: data => setRequest(data.responseText)
            })
        } else {
            $.ajax({
                url: "/api/requests/",
                method: "POST",
                headers: {"X-CSRFToken": $.cookie("csrftoken")},
                contentType: "application/json",
                data: JSON.stringify(request),
                success: () => {
                    setRequest({})
                    setShow(false)
                    update()
                },
                error: data => setRequest(data.responseText)
            })
        }
    }

    const upload = e => {
        const formData = new FormData()
        formData.append("file", e.target.files[0])
        $.ajax({
            url: "/api/upload",
            method: "POST",
            headers: {"X-CSRFToken": $.cookie("csrftoken")},
            processData: false,
            contentType: false,
            data: formData,
            success: data => setRequest({...request, file: data.file})
        })
    }

    const changeHandler = e => {
        setRequest({...request, [e.target.name]: e.target.value})
    }

    return (
        <>
            <table id="table" className="table table-striped text-center align-middle">
                <thead>
                    <tr>
                        <td>#</td>
                        <td>نام اثر</td>
                        <td>نوع اثر</td>
                        <td>نام رسانه</td>
                        <td>کلید واژه</td>
                        <td>ثبت کننده</td>
                        <td>تاریخ ثبت</td>
                        <td>وضعیت</td>
                        <td>عملیات</td>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((request, index) => (
                            <tr>
                                <td>{index + 1}</td>
                                <td>
                                    <button className="btn" onClick={() => edit(request.id)}>
                                        {request.name}
                                    </button>
                                </td>
                                <td>{config.choices.request.type[request.type]}</td>
                                <td>{config.choices.request.media[request.media]}</td>
                                <td className="d-flex flex-wrap justify-content-center">
                                    {request.keywords ? request.keywords.split(", ").map(word => (
                                        <span className="bg-primary rounded text-light m-1 p-1">{word}</span>
                                    )): null}
                                </td>
                                <td>{request.created_by ? request.created_by.first_name + " " + request.created_by.last_name: null}</td>
                                <td>{moment(request.created_at).format("YYYY-MM-DD")}</td>
                                <td>{config.choices.request.status[request.status]}</td>
                                <td>
                                    <button className="btn btn-secondary m-1" onClick={() => edit(request.id)}><i className="fa-solid fa-pen-to-square"></i></button>
                                    <button className="btn btn-danger m-1" onClick={() => _delete(request.id)}><i className="fa-solid fa-xmark"></i></button>
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
            <hr />
            <div className="m-1 p-1">
                <h5 className="text-center">جست و جو</h5>
                <div className="row">
                    <div className="col-sm">
                        <label className="form-label" for="name__contains">نام اثر:</label>
                        <input className="form-control" type="text" name="name__contains" id="name__contains" value={request.name__contains} onChange={changeHandler} />
                    </div>
                    <div className="col-sm">
                        <label className="form-label" for="type__contains">نوع اثر:</label>
                        <select className="form-select" name="type__contains" id="type__contains" value={request.type__contains} onChange={changeHandler}>
                            <option value=""></option>
                            {config.choices.request.type.map((item, index) => <option value={index}>{item}</option>)}
                        </select>
                    </div>
                    <div className="col">
                        <label className="form-label" for="media__contains">رسانه:</label>
                        <select className="form-select" name="media__contains" id="media__contains" value={request.media__contains} onChange={changeHandler}>
                            <option value=""></option>
                            {config.choices.request.media.map((item, index) => <option value={index}>{item}</option>)}
                        </select>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm">
                        <label className="form-label" for="genre__contains">ژانر:</label>
                        <select className="form-select" name="genre__contains" id="genre__contains" value={request.genre__contains} onChange={changeHandler}>
                            <option value=""></option>
                            {config.choices.request.genre.map((item, index) => <option value={index}>{item}</option>)}
                        </select>
                    </div>
                    <div className="col-sm">
                        <label className="form-label" for="ages__contains">رده سنی:</label>
                        <select className="form-select" name="ages__contains" id="ages__contains" value={request.ages__contains} onChange={changeHandler}>
                            <option value=""></option>
                            {config.choices.request.ages.map((item, index) => <option value={index}>{item}</option>)}
                        </select>
                    </div>
                    <div className="col">
                        <label className="form-label" for="status__contains">وضعیت:</label>
                        <select className="form-select" name="status__contains" id="status__contains" value={request.status__contains} onChange={changeHandler}>
                            <option value=""></option>
                            {config.choices.request.status.map((item, index) => <option value={index}>{item}</option>)}
                        </select>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm">
                        <label className="form-label" for="author">نویسنده:</label>
                        <input className="form-control" type="text" name="author__contains" id="author__contains" value={request.author__contains} onChange={changeHandler} />
                    </div>
                    <div className="col-sm">
                        <label className="form-label" for="producer__contains">تهيه كننده:</label>
                        <input className="form-control" type="text" name="producer__contains" id="producer__contains" value={request.producer__contains} onChange={changeHandler} />
                    </div>
                    <div className="col">
                        <label className="form-label" for="director__contains">کارگردان:</label>
                        <input className="form-control" type="text" name="director__contains" id="director__contains" value={request.director__contains} onChange={changeHandler} />
                    </div>
                </div>
                <button className="btn btn-primary w-100 mt-2" onClick={filter}>جست و جو <i className="fa-solid fa-magnifying-glass"></i></button>
            </div>
            <ReactBootstrap.Modal show={show} size="lg">
                <div className="modal-header">
                    <h5>اضافه/ویرایش کردن</h5>
                    <button type="button" className="btn-close" onClick={() => setShow(false)}></button>
                </div>
                <div className="modal-body">
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#nav-main">اطلاعات اصلی</button>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#nav-evaluation">ارزیابی</button>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#nav-considerations">ملاحظات</button>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#nav-files">مستندات</button>
                        </li>
                    </ul>
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="nav-main">
                            <div className="row">
                                <div className="col-sm">
                                    <label className="form-label" for="name">نام اثر:</label>
                                    <input className="form-control" type="text" name="name" id="name" value={request.name} onChange={changeHandler} required />
                                </div>
                                <div className="col">
                                    <label className="form-label" for="type">نوع اثر:</label>
                                    <select className="form-select" name="type" id="type" value={request.type} onChange={changeHandler} required>
                                        <option value=""></option>
                                        {config.choices.request.type.map((item, index) => <option value={index}>{item}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm">
                                    <label className="form-label" for="media">رسانه:</label>
                                    <select className="form-select" name="media" id="media" value={request.media} onChange={changeHandler} required>
                                        <option value=""></option>
                                        {config.choices.request.media.map((item, index) => <option value={index}>{item}</option>)}
                                    </select>
                                </div>
                                <div className="col">
                                    <label className="form-label" for="genre">ژانر:</label>
                                    <select className="form-select" name="genre" id="genre" value={request.genre} onChange={changeHandler} required>
                                        <option value=""></option>
                                        {config.choices.request.genre.map((item, index) => <option value={index}>{item}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm">
                                    <label className="form-label" for="author">نویسنده:</label>
                                    <input className="form-control" name="author" id="author" value={request.author} onChange={changeHandler} />
                                </div>
                                <div className="col-sm">
                                    <label className="form-label" for="producer">تهیه کننده:</label>
                                    <input className="form-control" name="producer" id="producer" value={request.producer} onChange={changeHandler} />
                                </div>
                                <div className="col">
                                    <label className="form-label" for="director">کارگردان:</label>
                                    <input className="form-control" name="director" id="director" value={request.director} onChange={changeHandler} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm">
                                    <label className="form-label" for="ages">رده سنی:</label>
                                    <select className="form-select" name="ages" id="ages" value={request.ages} onChange={changeHandler} required>
                                        <option value=""></option>
                                        {config.choices.request.ages.map((item, index) => <option value={index}>{item}</option>)}
                                    </select>
                                </div>
                                <div className="col">
                                    <label className="form-label" for="status">وضعیت:</label>
                                    <select className="form-select" name="status" id="status" value={request.status} onChange={changeHandler} required>
                                        <option value=""></option>
                                        {config.choices.request.status.map((item, index) => <option value={index}>{item}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm">
                                    <label className="form-label" for="keywords">کلید واژه ها:</label>
                                    <input className="form-control" type="text" name="keywords" id="keywords" value={request.keywords} onChange={changeHandler} />
                                </div>
                                <div className="col d-flex justify-content-evenly align-items-center flex-wrap">
                                    {request.keywords ? request.keywords.split(", ").map(word => (
                                        <span className="bg-secondary rounded text-light m-1 p-1">{word}</span>
                                    )): null}
                                </div>
                            </div>
                            <label className="form-label" for="created_at">تاریخ ثبت:</label>
                            <input className="form-control" type="text" name="created_at" id="created_at" value={request.created_at ? moment(request.created_at).format("YYYY-MM-DD"): null} required />
                            <label for="description">خلاصه طرح:</label>
                            <textarea className="form-control" name="description" id="description" value={request.description} onChange={changeHandler}></textarea>
                            <label for="file">فایل اثر:</label>
                            <div className="row">
                                <div className="col-sm">
                                    <input className="form-control" type="file" name="file" id="file" onChange={upload} />
                                </div>
                                <div className="col">
                                    <a className="form-control" href={"/media/" + request.file}>{request.file ? request.file : "فایلی وجود ندارد"}</a>
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="nav-evaluation">
                            <Evaluations request={request.id} />
                        </div>
                        <div className="tab-pane fade" id="nav-considerations">
                            <div className="border rounded m-1 p-1">
                                <label className="form-label" for="working_group_at">تاریخ کارگروه:</label>
                                <input className="form-control" type="text" name="working_group_at" id="working_group_at" value={request.working_group_at ? moment(request.working_group_at).format("YYYY-MM-DD") : null} />
                                <label className="form-label" for="working_group_users">اعضاء کارگروه:</label>
                                <select className="form-select" name="working_group_users" id="working_group_users" value={request.working_group_users} onChange={(e) => setRequest({...request, [e.target.name]: $(e.target).val()})} multiple>
                                    <option value=""></option>
                                    {get_group_users("کارگروه").map(u => <option value={u.id}>{u.first_name} {u.last_name}</option>)}
                                </select>
                                <label className="form-label" for="working_group_considerations">ملاحظات کارگروه:</label>
                                <textarea className="form-control" name="working_group_considerations" id="working_group_considerations" value={request.working_group_considerations} onChange={changeHandler}></textarea>
                            </div>
                            <div className="border rounded m-1 p-1">
                                <label className="form-label" for="council_at">تاریخ شورا:</label>
                                <input className="form-control" type="text" name="council_at" id="council_at" value={request.council_at ? moment(request.council_at).format("YYYY-MM-DD") : null} />
                                <label className="form-label" for="council_users">اعضاء شورا:</label>
                                <select className="form-select" name="council_users" id="council_users" value={request.council_users} onChange={(e) => setRequest({...request, [e.target.name]: $(e.target).val()})} multiple>
                                    <option value=""></option>
                                    {get_group_users("شورا").map(u => <option value={u.id}>{u.first_name} {u.last_name}</option>)}
                                </select>
                                <label className="form-label" for="council_considerations">ملاحظات شورا:</label>
                                <textarea className="form-control" name="council_considerations" id="council_considerations" value={request.council_considerations}  onChange={changeHandler} multiple></textarea>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="nav-files">
                            <table className="table align-middle text-center">
                                <thead>
                                    <tr>
                                        <td>#</td>
                                        <td>فایل</td>
                                        <td>عملیات</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {request.files ? request.files.map((file, index) => (
                                    <tr>
                                        <td>{index}</td>
                                        <td>
                                            <a href={"/media/" + file}>{file}</a>
                                        </td>
                                        <td>
                                            <button className="btn btn-danger" onClick={() => {request.files.splice(index, 1); setRequest({...request, files: request.files})}}><i className="fa-solid fa-xmark"></i></button>
                                        </td>
                                    </tr>
                                    )): null}
                                </tbody>
                            </table>
                            <input className="form-control" type="file" multiple />
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-primary" onClick={save}>ذخیره</button>
                </div>
            </ReactBootstrap.Modal>
            <button className="btn btn-light position-absolute bottom-0 end-0 m-1 p-2" onClick={() => {setRequest({}); setShow(true)}} >
                <i className="fa-solid fa-plus"></i>
            </button>
        </>
    )
}

const Evaluations = props => {
    const [evaluations, setEvaluations] = React.useState([])

    const update = () => {
        $.ajax({
            url: `/api/evaluations?request=${props.request}`,
            success: setEvaluations
        })
    }

    React.useEffect(update, [])

    const send = () => {
        $("#evaluators").val().forEach(x => {
            $.ajax({
                url: `/api/evaluations/`,
                method: "POST",
                headers: {"X-CSRFToken": $.cookie("csrftoken")},
                contentType: "application/json",
                data: JSON.stringify({request: props.request, evaluator: x, note: $("#note").val() || null}),
                success: update
            })
        })
    }

    const _delete = id => {
        $.ajax({
            url: `/api/evaluations/${id}/`,
            method: "DELETE",
            headers: {"X-CSRFToken": $.cookie("csrftoken")},
            success: update
        })
    }

    return (
        <div>
            <table className="table align-middle">
                <thead>
                    <tr>
                        <td>#</td>
                        <td>ارزیاب</td>
                        <td>ارسال کننده</td>
                        <td>زمان ارسال</td>
                        <td>وضعیت</td>
                        <td>عملیات</td>
                    </tr>
                </thead>
                <tbody>
                    {evaluations.map(e => (
                        <tr>
                            <td>{e.id}</td>
                            <td>{e.evaluator.first_name} {e.evaluator.last_name} </td>
                            <td>{e.created_by.first_name} {e.created_by.last_name}</td>
                            <td>{moment(e.created_at).format("YYYY-MM-DD")}</td>
                            <td>{config.choices.evaluation.status[e.status]}</td>
                            <td>
                                <a className="btn btn-primary m-1" href={"/evaluation?id=" + e.id}><i className="fa-solid fa-print"></i></a>
                                <a className="btn btn-secondary m-1" href={"/evaluations?id=" + e.id}><i className="fa-solid fa-pen-to-square"></i></a>
                                <button className="btn btn-danger m-1" onClick={() => _delete(e.id)}><i className="fa-solid fa-xmark"></i></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="row">
                <div className="col-8">
                    <div className="form-group m-1">
                        <label className="form-label" for="evaluator">ارزیاب:</label>
                        <select className="form-select" name="evaluators" id="evaluators" multiple>
                            {get_group_users("ارزیاب").map(x => <option value={x.id}>{x.first_name} {x.last_name}</option>)}
                        </select>
                    </div>
                    <input className="form-control m-1" type="text" id="note" placeholder="یادداشت" />
                </div>
                <div className="col d-flex justify-content-center align-items-center">
                    <button className="btn btn-secondary" onClick={send}>ارسال به ارزیاب</button>
                </div>
            </div>
        </div>
    )
}

ReactDOM.render(<Requests />, document.getElementById("app"))
