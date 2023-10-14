const Requests = () => {
    const [requests, setRequests] = React.useState([])
    const [show, setShow] = React.useState(false)
    const [request, setRequest] = React.useState({})
    const [evaluations, setEvaluations] = React.useState([])

    const init = () => {
        setRequest({})
        setEvaluations([])
    }

    const update = (data) => {
        $("#table").DataTable().destroy()
        setRequests(data)
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
                    customize: (doc) => {
                        $(doc.document.body).css('direction', 'rtl');
                    }
                }, "copy"
            ]
        })
    }

    React.useEffect(() => {
        init()
        $.ajax({
            url: "/api/get_requests",
            method: "POST",
            headers: {"X-CSRFToken": $.cookie("csrftoken")},
            success: (data) => {
                update(data.requests)
            }
        })
    }, [])

    const filter = () => {
        $.ajax({
            url: "/api/get_requests",
            method: "POST",
            headers: {"X-CSRFToken": $.cookie("csrftoken")},
            data: JSON.stringify(request, (k, v) => v ? v : undefined),
            success: (data) => {
                update(data.requests)
            }
        })
    }

    const _edit = (id) => {
        $.ajax({
            url: "/api/get_request",
            method: "POST",
            headers: {"X-CSRFToken": $.cookie("csrftoken")},
            data: JSON.stringify({id: id}),
            success: (data) => {
                setRequest(data.request)
                setShow(true)
            }
        })
        $.ajax({
            url: "/api/get_evaluations",
            method: "POST",
            headers: {"X-CSRFToken": $.cookie("csrftoken")},
            data: JSON.stringify({request_id: id}),
            success: (data) => {
                setEvaluations(data.evaluations)
            }
        })
    }

    const _delete = (id) => {
        $.ajax({
            url: "/api/delete_request",
            method: "POST",
            headers: {"X-CSRFToken": $.cookie("csrftoken")},
            data: JSON.stringify({id: id}),
            dataType: "json",
            success: (data) => {
                update(data.requests)
            }
        })
    }

    const save = () => {
        var check = false
        $(".form-control, .form-select").each((index, element) => {
            if (element.attributes["required"]) {
                if (element.value == "") {
                    element.className = "form-control is-invalid"
                    check = true
                }
                else element.className = "form-control is-valid"
            }
        })
        if (!check) {
            $.ajax({
                url: "/api/save_request",
                method: "POST",
                headers: {"X-CSRFToken": $.cookie("csrftoken")},
                data: JSON.stringify(request, (k, v) => v ? v : undefined),
                dataType: "json",
                success: (data) => {
                    update(data.requests)
                    setRequest({})
                    setShow(false)
                }
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
            data: formData,
            processData: false,
            contentType: false,
            success: data => setRequest({...request, file: data.file})
        })
    }

    const upload_files = e => {
        const files = new FormData()
        Array.from(e.target.files).forEach(file => {
            files.append(file.name, file)
        });
        $.ajax({
            url: "/api/upload_files",
            method: "POST",
            headers: {"X-CSRFToken": $.cookie("csrftoken")},
            data: _files,
            processData: false,
            contentType: false,
            success: data => {
                if (request.files)
                    request.files.push(data.files)
                else request.files = data.files
                setRequest({...request, files: request.files})
            }
        })
    }

    const create_evaluation = () => {
        $.ajax({
            url: "/api/create_evaluation",
            method: "POST",
            headers: {"X-CSRFToken": $.cookie("csrftoken")},
            data: JSON.stringify({request_id: request.id, evaluators: $("#evaluators").val(), note: $("#note").val()}),
            success: (data) => {
                setEvaluations(data.evaluations)
            }
        })
    }

    const delete_evaluation = (id) => {
        $.ajax({
            url: "/api/delete_evaluation",
            method: "POST",
            headers: {"X-CSRFToken": $.cookie("csrftoken")},
            data: JSON.stringify({request_id: request.id, id: id}),
            success: (data) => {
                setEvaluations(data.evaluations)
            }
        })
    }

    const changeHandler = (e) => {
        setRequest({...request, [e.target.name]: e.target.value})
    }

    return (
        <>
            <table id="table" class="table table-striped text-center align-middle">
                <thead>
                    <tr>
                        <td>#</td>
                        <td>نام اثر</td>
                        <td>نوع اثر</td>
                        <td>نام رسانه</td>
                        <td>کلید واژه</td>
                        <td>ثبت کننده</td>
                        <td>زمان ثبت</td>
                        <td>وضعیت</td>
                        <td>عملیات</td>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((request, index) => (
                            <tr>
                                <td>{index + 1}</td>
                                <td>
                                    <button class="btn" onClick={() => _edit(request.id)}>
                                        {request.name}
                                    </button>
                                </td>
                                <td>{config.choices.request.type[request.type]}</td>
                                <td>{config.choices.request.media[request.media]}</td>
                                <td>
                                    {request.keywords ? request.keywords.split(",").map((word) => (
                                        <span class="bg-primary rounded text-light m-1 p-1">{word}</span>
                                    )): null}
                                </td>
                                <td>{request.created_by.first_name} {request.created_by.last_name}</td>
                                <td dir="ltr">{request.created_at}</td>
                                <td>{config.choices.request.status[request.status]}</td>
                                <td>
                                    <button class="btn btn-secondary m-1" onClick={() => _edit(request.id)}><i class="fa-solid fa-pen-to-square"></i></button>
                                    <button class="btn btn-danger m-1" onClick={() => _delete(request.id)}><i class="fa-solid fa-xmark"></i></button>
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
            <hr />
            <div class="m-1 p-1">
                <h5 class="text-center">جست و جو</h5>
                <div class="row">
                    <div class="col-sm">
                        <label class="form-label" for="name__contains">نام اثر:</label>
                        <input class="form-control" type="text" name="name__contains" id="name__contains" value={request.name__contains} onChange={changeHandler} />
                    </div>
                    <div class="col-sm">
                        <label class="form-label" for="type__contains">نوع اثر:</label>
                        <select class="form-select" name="type__contains" id="type__contains" value={request.type__contains} onChange={changeHandler}>
                            <option value=""></option>
                            {config.choices.request.type.map((item, index) => <option value={index}>{item}</option>)}
                        </select>
                    </div>
                    <div class="col">
                        <label class="form-label" for="media__contains">رسانه:</label>
                        <select class="form-select" name="media__contains" id="media__contains" value={request.media__contains} onChange={changeHandler}>
                            <option value=""></option>
                            {config.choices.request.media.map((item, index) => <option value={index}>{item}</option>)}
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm">
                        <label class="form-label" for="genre__contains">ژانر:</label>
                        <select class="form-select" name="genre__contains" id="genre__contains" value={request.genre__contains} onChange={changeHandler}>
                            <option value=""></option>
                            {config.choices.request.genre.map((item, index) => <option value={index}>{item}</option>)}
                        </select>
                    </div>
                    <div class="col-sm">
                        <label class="form-label" for="ages__contains">رده سنی:</label>
                        <select class="form-select" name="ages__contains" id="ages__contains" value={request.ages__contains} onChange={changeHandler}>
                            <option value=""></option>
                            {config.choices.request.ages.map((item, index) => <option value={index}>{item}</option>)}
                        </select>
                    </div>
                    <div class="col">
                        <label class="form-label" for="status__contains">وضعیت:</label>
                        <select class="form-select" name="status__contains" id="status__contains" value={request.status__contains} onChange={changeHandler}>
                            <option value=""></option>
                            {config.choices.request.status.map((item, index) => <option value={index}>{item}</option>)}
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm">
                        <label class="form-label" for="author">نویسنده:</label>
                        <input class="form-control" type="text" name="author__contains" id="author__contains" value={request.author__contains} onChange={changeHandler} />
                    </div>
                    <div class="col-sm">
                        <label class="form-label" for="producer__contains">تهيه كننده:</label>
                        <input class="form-control" type="text" name="producer__contains" id="producer__contains" value={request.producer__contains} onChange={changeHandler} />
                    </div>
                    <div class="col">
                        <label class="form-label" for="director__contains">کارگردان:</label>
                        <input class="form-control" type="text" name="director__contains" id="director__contains" value={request.director__contains} onChange={changeHandler} />
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm">
                        <label class="form-label" for="working_group_users__contains">اعضا کارگروه:</label>
                        <select class="form-select"  name="working_group_users__contains" id="working_group_users__contains" multiple value={request.working_group_users__contains} onChange={changeHandler}>
                            <option value=""></option>
                            {get_group_users("کارگروه").map(user => <option value={user.id}>{user.first_name} {user.last_name}</option>)}
                        </select>
                    </div>
                    <div class="col">
                        <label class="form-label" for="council_users__contains">اعضا شورا:</label>
                        <select class="form-select"  name="council_users__contains" id="council_users__contains" multiple value={request.council_users__contains} onChange={changeHandler}>
                            <option value=""></option>
                            {get_group_users("شورا").map(user => <option value={user.id}>{user.first_name} {user.last_name}</option>)}
                        </select>
                    </div>
                </div>
                <button class="btn btn-primary w-100 mt-2" onClick={filter}>جست و جو <i class="fa-solid fa-magnifying-glass"></i></button>
            </div>
            <ReactBootstrap.Modal show={show} size="lg">
                <div class="modal-header">
                    <h5>اضافه/ویرایش کردن</h5>
                    <button type="button" class="btn-close" onClick={() => setShow(false)}></button>
                </div>
                <div class="modal-body">
                    <ul class="nav nav-tabs">
                        <li class="nav-item">
                            <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#nav-main">اطلاعات اصلی</button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#nav-evaluation">ارزیابی</button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#nav-considerations">ملاحظات</button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#nav-files">مستندات</button>
                        </li>
                    </ul>
                    <div class="tab-content">
                        <div class="tab-pane fade show active" id="nav-main">
                            <div class="row">
                                <div class="col-sm">
                                    <label class="form-label" for="name">نام اثر:</label>
                                    <input class="form-control" type="text" name="name" id="name" value={request.name} onChange={changeHandler} required />
                                </div>
                                <div class="col">
                                    <label class="form-label" for="type">نوع اثر:</label>
                                    <select class="form-select" name="type" id="type" value={request.type} onChange={changeHandler} required>
                                        <option value=""></option>
                                        {config.choices.request.type.map((item, index) => <option value={index}>{item}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm">
                                    <label class="form-label" for="media">رسانه:</label>
                                    <select class="form-select" name="media" id="media" value={request.media} onChange={changeHandler} required>
                                        <option value=""></option>
                                        {config.choices.request.media.map((item, index) => <option value={index}>{item}</option>)}
                                    </select>
                                </div>
                                <div class="col">
                                    <label class="form-label" for="genre">ژانر:</label>
                                    <select class="form-select" name="genre" id="genre" value={request.genre} onChange={changeHandler} required>
                                        <option value=""></option>
                                        {config.choices.request.genre.map((item, index) => <option value={index}>{item}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm">
                                    <label class="form-label" for="author">نویسنده:</label>
                                    <input class="form-control" name="author" id="author" value={request.author} onChange={changeHandler} />
                                </div>
                                <div class="col-sm">
                                    <label class="form-label" for="producer">تهیه کننده:</label>
                                    <input class="form-control" name="producer" id="producer" value={request.producer} onChange={changeHandler} />
                                </div>
                                <div class="col">
                                    <label class="form-label" for="director">کارگردان:</label>
                                    <input class="form-control" name="director" id="director" value={request.director} onChange={changeHandler} />
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm">
                                    <label class="form-label" for="ages">رده سنی:</label>
                                    <select class="form-select" name="ages" id="ages" value={request.ages} onChange={changeHandler} required>
                                        <option value=""></option>
                                        {config.choices.request.ages.map((item, index) => <option value={index}>{item}</option>)}
                                    </select>
                                </div>
                                <div class="col">
                                    <label class="form-label" for="status">وضعیت:</label>
                                    <select class="form-select" name="status" id="status" value={request.status} onChange={changeHandler} required>
                                        <option value=""></option>
                                        {config.choices.request.status.map((item, index) => <option value={index}>{item}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm">
                                    <label class="form-label" for="keywords">کلید واژه ها:</label>
                                    <input class="form-control" type="text" name="keywords" id="keywords" value={request.keywords} onChange={changeHandler} />
                                </div>
                                <div class="col d-flex justify-content-center align-items-center flex-wrap">
                                    {request.keywords ? request.keywords.split(",").map((word) => (
                                        <span class="bg-secondary rounded text-light m-1 p-1">{word}</span>
                                    )): null}
                                </div>
                            </div>
                            <label class="form-label" for="created_at">تاریخ ثبت:</label>
                            <input class="form-control" type="datetime" name="created_at" id="created_at" dir="ltr" value={request.created_at} required />
                            <label for="description">خلاصه یک خطی:</label>
                            <textarea class="form-control" name="description" id="description" value={request.description} onChange={changeHandler}></textarea>
                            <label for="file">فایل اثر:</label>
                            <div class="row">
                                <div class="col-sm">
                                    <input class="form-control" type="file" name="file" id="file" onChange={upload} />
                                </div>
                                <div class="col">
                                    <a class="form-control" dir="ltr" href={"/media/" + request.file}>{request.file ? request.file : "فایلی وجود ندارد"}</a>
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="nav-evaluation">
                            <table class="table align-middle">
                                <thead>
                                    <tr>
                                        <td>ارزیاب</td>
                                        <td>ارسال کننده</td>
                                        <td>زمان ارسال</td>
                                        <td>وضعیت</td>
                                        <td>عملیات</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {evaluations.map((e) => (
                                        <tr>
                                            <td>{e.evaluator.first_name} {e.evaluator.last_name} </td>
                                            <td>{e.created_by.first_name} {e.created_by.last_name}</td>
                                            <td>{e.created_at}</td>
                                            <td>{config.choices.evaluation.status[e.status]}</td>
                                            <td>
                                                <button class="btn btn-secondary m-1" onClick={() => {setShow(false); window.showEvaluation(e.id)}}>
                                                    <i class="fa-solid fa-pen-to-square"></i>
                                                </button>
                                                <button class="btn btn-danger m-1" onClick={() => delete_evaluation(e.id)}><i class="fa-solid fa-xmark"></i></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div class="row">
                                <div class="col-8">
                                    <div class="form-group m-1">
                                        <label class="form-label" for="evaluator">ارزیاب:</label>
                                        <select class="form-select" name="evaluators" id="evaluators" multiple>
                                            {get_group_users("ارزیاب").map((e) => <option value={e.id}>{e.first_name} {e.last_name}</option>)}
                                        </select>
                                    </div>
                                    <input class="form-control m-1" type="text" id="note" placeholder="یادداشت" />
                                </div>
                                <div class="col d-flex justify-content-center align-items-center">
                                    <button class="btn btn-secondary" onClick={create_evaluation}>ارسال به ارزیاب</button>
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="nav-considerations">
                            <div class="border rounded m-1 p-1">
                                <label class="form-label" for="working_group_considerations">ملاحظات کارگروه:</label>
                                <textarea class="form-control" name="working_group_considerations" id="working_group_considerations" value={request.working_group_considerations} onChange={changeHandler}></textarea>
                                <label class="form-label" for="working_group_at">تاریخ کارگروه:</label>
                                <input class="form-control" type="datetime" name="working_group_at" id="working_group_at" value={request.working_group_at} onChange={changeHandler} />
                                <label class="form-label" for="working_group_users">اعضاء کارگروه:</label>
                                <select class="form-select" name="working_group_users" id="working_group_users" value={request.working_group_users} onChange={(e) => setRequest({...request, [e.target.name]: $(e.target).val()})} multiple>
                                    <option value=""></option>
                                    {get_group_users("کارگروه").map((e) => <option value={e.id}>{e.first_name} {e.last_name}</option>)}
                                </select>
                            </div>
                            <div class="border rounded m-1 p-1">
                                <label class="form-label" for="council_considerations">ملاحظات شورا:</label>
                                <textarea class="form-control" name="council_considerations" id="council_considerations" value={request.council_considerations}  onChange={changeHandler} multiple></textarea>
                                <label class="form-label" for="council_at">تاریخ کارگروه:</label>
                                <input class="form-control" type="datetime" name="council_at" id="council_at" value={request.council_at} onChange={changeHandler} />
                                <label class="form-label" for="council_users">اعضاء کارگروه:</label>
                                <select class="form-select" name="council_users" id="council_users" value={request.council_users} onChange={(e) => setRequest({...request, [e.target.name]: $(e.target).val()})} multiple>
                                    <option value=""></option>
                                    {get_group_users("شورا").map((e) => <option value={e.id}>{e.first_name} {e.last_name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="nav-files">
                            <table class="table align-middle text-center">
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
                                            <button class="btn btn-danger" onClick={() => {request.files.splice(index, 1); setRequest({...request, files: request.files})}}><i class="fa-solid fa-xmark"></i></button>
                                        </td>
                                    </tr>
                                    )): null}
                                </tbody>
                            </table>
                            <input class="form-control" type="file" onChange={upload_files} multiple />
                        </div>
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

ReactDOM.render(<Requests />, document.getElementById("Requests"))
