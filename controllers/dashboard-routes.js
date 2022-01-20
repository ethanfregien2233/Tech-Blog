const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const auth = require('../utils/auth');

router.get('/', auth, (req, res) => {
    Post.findAll({ where: {user_id: req.session.user_id},
                attributes: [ 
                    'id',
                    'contents',
                    'title',
                    'user_id',
                    'created_at'
                ],
                include: [
                    {
                        model: Comment,
                        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                        include: {
                            model: User,
                            attributes: ['username']
                        }
                    },
                    {
                        model: User,
                        attributes: ['username']
                    }
                ]
            })
            .then(dbPostData => {
                const posts = dbPostData.map(post => post.get({ plain: true }));
                res.render('dashboard', {posts, loggedIn: true});
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
});


router.get('/edit/:id', auth, (req, res) => {
    Post.findOne({
        where: {id: req.params.id},
        attributes: [ 
            'id',
            'contents',
            'title',
            'user_id',
            'created_at'
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        if(!dbPostData) {
            res.status(404).json({message: 'No post found'});
            return;
        }
        const post = dbPostData.get({plain: true});
        res.render('edit-post', { post, loggedIn: req.session.loggedIn});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


module.exports = router;