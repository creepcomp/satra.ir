const Login = () => {
    const [message, setMessage] = React.useState("")
    const [data, setData] = React.useState({})

    const login = () => {
        $.ajax({
            url: "/api/users/login/",
            method: "POST",
            headers: { "X-CSRFToken": $.cookie("csrftoken") },
            contentType: "application/json",
            data: JSON.stringify(data),
            success: data => {
                document.location = "/";
            },
            error: xhr => {
                setMessage(JSON.parse(xhr.responseText).message);
            }
        })
    }

    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    return (
        <div class="col-lg-4 rounded bg-light shadow mx-lg-auto m-2 p-1">
            <h2 class="text-center m-2">ورود به سامانه</h2>
            {message ? <p class="alert alert-secondary">{message}</p> : null}
            <div class="m-1">
                <label class="form-label" for="username">نام کاربری:</label>
                <input class="form-control" type="text" name="username" id="username" onChange={changeHandler} value={data.username} />
            </div>
            <div class="m-1">
                <label class="form-label" for="password">رمز عبور:</label>
                <input class="form-control" type="password" name="password" id="password" onChange={changeHandler} value={data.password} />
            </div>
            <button class="btn btn-primary d-block w-50 mx-auto m-1" onClick={login}>ورود</button>
        </div>
    )
}

ReactDOM.render(<Login />, document.getElementById("app"))
