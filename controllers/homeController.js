const dummy_posts = [
    {
        id: 1,
        img: "https://images.coplusk.net/project_images/181479/image/105830_2F2014-11-26-161011-20141126_124438%2B_281_29.jpg",
        title: "Papierrosen",
        description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, ...",
    },
    {
        id: 2,
        img: "https://1.bp.blogspot.com/_S842QDROCoo/S8sWEjWV1GI/AAAAAAAAAHo/TDGKgBLmHbs/s1600/schnecke.JPG",
        title: "Schnecke mit Plüschhaus",
        description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, ...",
    },
    {
        id: 3,
        img: "https://tse4.mm.bing.net/th?id=OIP.5-u1zAdSG7-sN7rG6Kuz4wHaFS&pid=Api",
        title: "Gartenbank",
        description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est...",
    },
    {
        id: 4,
        img: "https://i.pinimg.com/originals/45/5c/87/455c876b82f2ce786fa311deb630664a.jpg",
        title: "Bastelpumpkin",
        description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, ...",
    }
];
const Post = require("../models/post")
exports.showHome = (req, res, next) => {
    Post.find({}).then(posts => {
        console.log(posts)
        res.render("home.ejs", {posts: posts});
    })
};
