const Evaluations = () => {
    const [evaluations, setEvaluations] = React.useState([])
    const [evaluation, setEvaluation] = React.useState({
        id: null,
        status: 0,
        request: {},
        description: null,
        indicators: []
    })
    const [show, setShow] = React.useState(false)

    React.useEffect(() => {
        $.ajax({
            url: "/api/get_evaluations",
            method: "POST",
            headers: {"X-CSRFToken": $.cookie("csrftoken")},
            success: (data) => {
                setEvaluations(data.evaluations)
            }
        })
    }, [])

    const save = () => {
        $.ajax({
            url: "/api/save_evaluation",
            method: "POST",
            headers: {"X-CSRFToken": $.cookie("csrftoken")},
            data: JSON.stringify(evaluation),
            success: (data) => {
                setEvaluations(data.evaluations)
                setShow(false)
            }
        })
    }

    window.showEvaluation = id => {
        $.ajax({
            url: "/api/get_evaluation",
            method: "POST",
            headers: {"X-CSRFToken": $.cookie("csrftoken")},
            data: JSON.stringify({id: id}),
            success: (data) => {
                setEvaluation(data.evaluation)
                setShow(true)
            }
        })
    }

    const edit = id => window.showEvaluation(id)

    const _delete = id => {
        $.ajax({
            url: "/api/delete_evaluation",
            method: "POST",
            headers: {"X-CSRFToken": $.cookie("csrftoken")},
            data: JSON.stringify({id: id}),
            dataType: "json",
            success: (data) => {
                setEvaluations(data.evaluations)
            }
        })
    }

    const changeHandler = (e) => {
        setEvaluation({...evaluation, [e.target.name]: e.target.value})
    }

    const changeHandler2 = (e, i1, i2) => {
        const indicators = evaluation.indicators
        indicators[i1].items[i2][e.target.name] = e.target.value
        setEvaluation({...evaluation, indicators: indicators})
    }

    return (
        <>
            <table class="table align-middle">
                <thead>
                    <tr>
                        <td>#</td>
                        <td>نام اثر</td>
                        <td>نوع اثر</td>
                        <td>ارسال کننده</td>
                        <td>زمان ارسال</td>
                        <td>وضعیت</td>
                        <td>عملیات</td>
                    </tr>
                </thead>
                <tbody>
                    {evaluations.map((evaluation, index) => (
                        <tr>
                            <td>{index + 1}</td>
                            <td>{evaluation.request.name}</td>
                            <td>{config.choices.request.type[evaluation.request.type]}</td>
                            <td>{evaluation.created_by.first_name} {evaluation.created_by.last_name}</td>
                            <td>{evaluation.created_at}</td>
                            <td>{config.choices.evaluation.status[evaluation.status]}</td>
                            <td>
                                {evaluation.note ? (
                                    <span class="dropdown">
                                    <button class="btn btn-warning m-1" type="button" data-bs-toggle="dropdown"><i class="fa-solid fa-message"></i></button>
                                    <div class="dropdown-menu p-1">{evaluation.note}</div>
                                </span>
                                ): null}
                                <a class="btn btn-primary m-1" href={"/evaluation?id=" + evaluation.id}><i class="fa-solid fa-print"></i></a>
                                <button class="btn btn-secondary m-1" onClick={() => edit(evaluation.id)}><i class="fa-solid fa-pen-to-square"></i></button>
                                <button class="btn btn-danger m-1" onClick={() => _delete(evaluation.id)}><i class="fa-solid fa-xmark"></i></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ReactBootstrap.Modal show={show} size="lg">
                <div class="modal-header">
                    <h5>پاسخ ارزیابی</h5>
                    <button type="button" class="btn-close" onClick={() => setShow(false)}></button>
                </div>
                <div class="modal-body">
                    <div class="bg-primary bg-opacity-25 rounded shadow m-2 p-2 text-center">
                        <h4>اطلاعات اثر</h4>
                        <table class="table">
                            <tr>
                                <td>نام اثر: {evaluation.request.name}</td>
                                <td>نوع اثر: {config.choices.request.type[evaluation.request.type]}</td>
                            </tr>
                            <tr>
                                <td>ژانر: {config.choices.request.genre[evaluation.request.genre]}</td>
                                <td>رده سنی: {config.choices.request.ages[evaluation.request.ages]}</td>
                            </tr>
                        </table>
                    </div>
                    <ul class="nav nav-tabs">
                        <li class="nav-item">
                            <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#nav-main">اصلی</button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#nav-indicators">شاخص ها</button>
                        </li>
                    </ul>
                    <div class="tab-content">
                        <div class="tab-pane fade show active" id="nav-main">
                            <label class="form-label" for="status">وضعیت:</label>
                            <select class="form-select" name="status" id="status" value={evaluation.status} onChange={changeHandler}>
                                {config.choices.evaluation.status.map((item, index) => (
                                    <option value={index}>{item}</option>
                                ))}
                            </select>
                            <label class="form-label" for="description">خلاصه طرح:</label>
                            <textarea class="form-control" name="description" id="description" cols="30" rows="10" value={evaluation.description} onChange={changeHandler}></textarea>
                        </div>
                        <div class="tab-pane fade" id="nav-indicators">
                            {evaluation.indicators.map((parent, i1) => (
                                <div class="row border-bottom text-center align-items-center m-1">
                                    <div class="col-4">{parent.name}</div>
                                    <div class="col">
                                        {parent.items.map((child, i2) => (
                                            <div class="row align-items-center border rounded m-1">
                                                <div class="col-4">{child.name}</div>
                                                <div class="col">
                                                    <select class="form-select m-1" name="level1" value={child.level1} onChange={(e) => changeHandler2(e, i1, i2)}>
                                                        <option value="0">کم</option>
                                                        <option value="1">متوسط</option>
                                                        <option value="2">زیاد</option>
                                                    </select>
                                                    <select class="form-select m-1" name="level2" value={child.level2} onChange={(e) => changeHandler2(e, i1, i2)}>
                                                        <option value="0">غیر ترویج گر</option>
                                                        <option value="1">ترویج گر</option>
                                                    </select>
                                                    <textarea class="form-control m-1" placeholder="توضیحات" type="text" name="description" value={child.description} onChange={(e) => changeHandler2(e, i1, i2)} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onClick={save}>ذخیره</button>
                </div>
            </ReactBootstrap.Modal>
        </>
    )
}

ReactDOM.render(<Evaluations />, document.getElementById("Evaluations"))
