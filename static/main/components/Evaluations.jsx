const Evaluations = () => {
    const [evaluations, setEvaluations] = React.useState([]);
    const queryParameters = new URLSearchParams(window.location.search);
    const [evaluation, setEvaluation] = React.useState({
        request: {},
        created_by: {},
        indicators: []
    });
    const [show, setShow] = React.useState(false);

    React.useEffect(() => {
        $.ajax({
            url: "/api/get_evaluations",
            method: "POST",
            headers: {"X-CSRFToken": $.cookie("csrftoken")},
            success: data => {
                setEvaluations(data.evaluations)
            }
        })
        const evaluation_id = queryParameters.get("id")
        if (evaluation_id) edit(evaluation_id)
    }, [])

    const save = () => {
        const e = {...evaluation}
        delete e.request
        delete e.created_by
        delete e.evaluator
        $.ajax({
            url: "/api/save_evaluation",
            method: "POST",
            headers: {"X-CSRFToken": $.cookie("csrftoken")},
            data: JSON.stringify(e),
            success: data => {
                setEvaluations(data.evaluations)
                setShow(false)
            }
        })
    }

    const edit = id => {
        $.ajax({
            url: "/api/get_evaluation",
            method: "POST",
            headers: {"X-CSRFToken": $.cookie("csrftoken")},
            data: JSON.stringify({id: id}),
            success: data => {
                setEvaluation(data.evaluation)
                setShow(true)
            }
        })
    }

    const _delete = id => {
        $.ajax({
            url: "/api/delete_evaluation",
            method: "POST",
            headers: {"X-CSRFToken": $.cookie("csrftoken")},
            data: JSON.stringify({id: id}),
            dataType: "json",
            success: data => {
                setEvaluations(data.evaluations)
            }
        })
    }

    const changeHandler = e => {
        setEvaluation({...evaluation, [e.target.name]: e.target.value})
    }

    return (
        <>
            <table className="table align-middle">
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
                    {evaluations.map(evaluation => (
                        <tr>
                            <td>{evaluation.id}</td>
                            <td>{evaluation.request.name}</td>
                            <td>{config.choices.request.type[evaluation.request.type]}</td>
                            <td>{evaluation.created_by.first_name} {evaluation.created_by.last_name}</td>
                            <td>{evaluation.created_at}</td>
                            <td>{config.choices.evaluation.status[evaluation.status]}</td>
                            <td>
                                {evaluation.note ? (
                                    <span className="dropdown">
                                    <button className="btn btn-warning m-1" type="button" data-bs-toggle="dropdown"><i className="fa-solid fa-message"></i></button>
                                    <div className="dropdown-menu p-1">{evaluation.note}</div>
                                </span>
                                ): null}
                                <a className="btn btn-primary m-1" href={"/evaluation?id=" + evaluation.id}><i className="fa-solid fa-print"></i></a>
                                <button className="btn btn-secondary m-1" onClick={() => edit(evaluation.id)}><i className="fa-solid fa-pen-to-square"></i></button>
                                <button className="btn btn-danger m-1" onClick={() => _delete(evaluation.id)}><i className="fa-solid fa-xmark"></i></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ReactBootstrap.Modal show={show} size="lg">
                <div className="modal-header">
                    <h5>پاسخ ارزیابی</h5>
                    <button type="button" className="btn-close" onClick={() => setShow(false)}></button>
                </div>
                <div className="modal-body">
                    <div className="bg-primary bg-opacity-25 rounded shadow m-2 p-2 text-center">
                        <h4>اطلاعات اثر</h4>
                        <table className="table">
                            <tr>
                                <td>نام اثر: {evaluation.request.name}</td>
                                <td>نوع اثر: {config.choices.request.type[evaluation.request.type]}</td>
                                <td>ژانر: {config.choices.request.genre[evaluation.request.genre]}</td>
                            </tr>
                            <tr>
                                <td>رده سنی: {config.choices.request.ages[evaluation.request.ages]}</td>
                                <td>رسانه: {config.choices.request.media[evaluation.request.media]}</td>
                                <td>فایل اثر: {evaluation.request.file ? <a className="btn bg-primary text-light" dir="ltr" href={"/media/" + evaluation.request.file}>{evaluation.request.file}</a>: null}</td>
                            </tr>
                            <tr>
                                <td>نویسنده: {evaluation.request.author}</td>
                                <td>تهیه کننده: {evaluation.request.producer}</td>
                                <td>کارگردان: {evaluation.request.director}</td>
                            </tr>
                        </table>
                    </div>
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#nav-main">اصلی</button>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#nav-indicators">شاخص ها</button>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#nav-status">وضعیت</button>
                        </li>
                    </ul>
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="nav-main">
                            <label className="form-label" for="summary">خلاصه یک خطی:</label>
                            <input className="form-control" type="text" name="summary" id="summary" value={evaluation.summary} onChange={changeHandler} />
                            <div className="row">
                                <div className="col-sm">
                                    <label className="form-label" for="keywords">کلیدواژه:</label>
                                    <input className="form-control"  type="text" name="keywords" id="keywords" value={evaluation.keywords} onChange={changeHandler} />
                                </div>
                                <div className="col d-flex justify-content-evenly align-items-center flex-wrap">
                                    {evaluation.keywords ? evaluation.keywords.split(", ").map(e => (
                                        <span className="bg-primary rounded text-light m-1 p-1">{e}</span>
                                    )): null}
                                </div>
                            </div>
                            <label className="form-label" for="description">خلاصه طرح:</label>
                            <textarea className="form-control" name="description" id="description" cols="30" rows="10" value={evaluation.description} onChange={changeHandler}></textarea>
                        </div>
                        <div className="tab-pane fade" id="nav-indicators">
                            {evaluation.indicators.map((parent, i1) => (
                                <div className="row border-bottom text-center align-items-center m-1">
                                    <div className="col-4">{parent.name}</div>
                                    <div className="col">
                                        {parent.childs.map((child, i2) => (
                                            <div className="row align-items-center border rounded m-1">
                                                <div className="col-4">{child.name}</div>
                                                <div className="col">
                                                    <select className="form-select m-1" name="level" value={child.level} onChange={e => {
                                                        evaluation.indicators[i1].childs[i2][e.target.name] = parseInt(e.target.value);
                                                        setEvaluation({...evaluation, indicators: evaluation.indicators});
                                                    }}>
                                                        {config.choices.evaluation.indicators.level.map((item, index) => <option value={index}>{item}</option>)}
                                                    </select>
                                                    <textarea className="form-control m-1" placeholder="توضیحات" type="text" name="description" value={child.description} onChange={e => {
                                                        evaluation.indicators[i1].childs[i2][e.target.name] = e.target.value;
                                                        setEvaluation({...evaluation, indicators: evaluation.indicators});
                                                    }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="tab-pane fade" id="nav-status">
                            <label className="form-label" for="status">وضعیت:</label>
                            <select className="form-select" name="status" id="status" value={evaluation.status} onChange={changeHandler}>
                                {config.choices.evaluation.status.map((item, index) => <option value={index}>{item}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-primary" onClick={save}>ذخیره</button>
                </div>
            </ReactBootstrap.Modal>
        </>
    )
}

ReactDOM.render(<Evaluations />, document.getElementById("app"))
