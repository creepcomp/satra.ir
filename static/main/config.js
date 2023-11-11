var users = [];
var groups = [];

$.ajax({
    url: "/api/users/",
    success: (data) => users = data
});

$.ajax({
    url: "/api/groups/",
    success: (data) => groups = data
});

const get_user = id => {
    return users.find(x => x.id == id);
}

const get_group_users = name => {
    const group = groups.find(g => g.name == name);
    if (group) {
        return users.filter(u => u.groups.includes(group));
    }
}
