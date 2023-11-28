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

const get_user = id => users.find(x => x.id == id);
const get_group = id => groups.find(x => x.id == id);

const get_group_users = name => {
    group = groups.find(x => x.name == name)
    return users.filter(x => x.groups.find(y => y == group.id))
}
