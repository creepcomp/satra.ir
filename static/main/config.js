var config = {
    choices: {
        request: {
            type: [
                "اصل فیلمنامه",
                "طرح فیلمنامه",
                "برنامه"
            ],
            media: [
                "فیلیمو",
                "نماوا",
                "فیلم نت",
                "آپرا",
                "تماشاخونه",
                "شعله فیلم",
                "هنر پلاس",
                "فیلماز",
                "دکترتم تی‌وی",
                "فیروزه",
                "مستقل",
                "زینما"
            ],
            genre: [
                "کمدی",
                "اکشن",
                "تخیلی",
                "درام",
                "تاریخی",
                "عاشقانه",
                "فانتزی",
                "ماجراجویانه",
                "انیمیشن",
                "جنایی",
                "مستند",
                "ترسناک",
                "موزیکال",
                "معمایی",
                "جنگی",
                "جاسوسی",
                "کمدی سیاه"
            ],
            ages: [
                "کودک",
                "نوجوان",
                "بزرگسال"
            ],
            status: [
                "تایید مدارک",
                "ارزیابی",
                "پاسخ ارزیابی",
                "ارجاع به جلسه شورا",
                "نیاز به انجام اصلاحات",
                "مردود",
                "تایید"
            ]
        },
        evaluation: {
            status: [
                "در حال بررسی",
                "مشروط",
                "مردود",
                "نیاز به اصلاح"
            ]
        }
    },
    users: [],
    groups: []
}

$.ajax({
    url: "/api/get_users",
    method: "POST",
    headers: {"X-CSRFToken": $.cookie("csrftoken")},
    success: (data) => {
        config.users = data.users
    }
})

$.ajax({
    url: "/api/get_groups",
    method: "POST",
    headers: {"X-CSRFToken": $.cookie("csrftoken")},
    success: (data) => config.groups = data.groups
})

const get_group_users = name => {
    const group = config.groups.find(x => x.name == name)
    const users = config.users.filter(x => group.id in x.groups)
    return users || []
}
