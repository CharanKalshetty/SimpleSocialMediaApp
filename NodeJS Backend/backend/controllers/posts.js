const Post = require('../models/post');

exports.createPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        creator: req.userData.userId
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: 'Post added successfully',
            post: {
                id: createdPost._id,
                title: createdPost.title,
                content: createdPost.content,
                imagePath: createdPost.imagePath
            }
        });
    }).catch((error)=>{
        res.status(500).json({
            error: {
                message: "creating a post failed"
            }
        });
    });
}

exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.user
    });
    Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then(result => {
        if (result.n>0) {
            res.status(200).json({message: "update successful"});
        } else {
            res.status(401).json({message: "Not Authorised"});        
        }
    }).catch(error => {
        res.status(500).json({
            error: {
                message: "could not update post"
            }
        });
    });
}

exports.getAllPosts = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentpage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentpage) {
        postQuery.skip(pageSize * (currentpage-1)).limit(pageSize);
    }
    postQuery.then(documents => {
        fetchedPosts=documents;
        return Post.count();
    }).then(count => {
        res.status(200).json({
            message: "Posts fetched successfully",
            posts: fetchedPosts,
            maxPosts: count
        });
    }).catch(error=>{
        res.status(500).json({
            error: {
                message: "Fetching posts failed"
            }
        });
    });
}

exports.getPostById = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({message: "Post Not Found!"});
        }
    }).catch(error=>{
        res.status(500).json({
            error: {
                message: "Fetching post failed"
            }
        });
    });
}

exports.deletePost = (req, res, next) => {
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
        console.log(result);
        if (result.n>0) {
            res.status(200).json({message: "post deleted successfully"});
        } else {
            res.status(401).json({message: "Not Authorised"});        
        }
    }).catch(error=>{
        res.status(500).json({
            error: {
                message: "Fetching posts failed"
            }
        });
    });
}