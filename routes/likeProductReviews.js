/*
 * Copyright (c) 2014-2021 Bjoern Kimminich.
 * SPDX-License-Identifier: MIT
 */

const utils = require('../lib/utils')
const challenges = require('../data/datacache').challenges
const db = require('../data/mongodb')
const insecurity = require('../lib/insecurity')

module.exports = function productReviews () {
const privateKey = '-----BEGIN RSA PRIVATE KEY-----\r\nMIICXAIBAAKBgQDNwqLEe9wgTXCbC7+RPdDbBbeqjdbs4kOPOIGzqLpXvJXlxxW8iMz0EaM4BKUqYsIa+ndv3NAn2RxCd5ubVdJJcX43zO6Ko0TFEZx/65gY3BE0O6syCEmUP4qbSd6exou/F+WTISzbQ5FBVPVmhnYhG/kpwt/cIxK5iUn5hm+4tQIDAQABAoGBAI+8xiPoOrA+KMnG/T4jJsG6TsHQcDHvJi7o1IKC/hnIXha0atTX5AUkRRce95qSfvKFweXdJXSQ0JMGJyfuXgU6dI0TcseFRfewXAa/ssxAC+iUVR6KUMh1PE2wXLitfeI6JLvVtrBYswm2I7CtY0q8n5AGimHWVXJPLfGV7m0BAkEA+fqFt2LXbLtyg6wZyxMA/cnmt5Nt3U2dAu77MzFJvibANUNHE4HPLZxjGNXN+a6m0K6TD4kDdh5HfUYLWWRBYQJBANK3carmulBwqzcDBjsJ0YrIONBpCAsXxk8idXb8jL9aNIg15Wumm2enqqObahDHB5jnGOLmbasizvSVqypfM9UCQCQl8xIqy+YgURXzXCN+kwUgHinrutZms87Jyi+D8Br8NY0+Nlf+zHvXAomD2W5CsEK7C+8SLBr3k/TsnRWHJuECQHFE9RA2OP8WoaLPuGCyFXaxzICThSRZYluVnWkZtxsBhW2W8z1b8PvWUE7kMy7TnkzeJS2LSnaNHoyxi7IaPQUCQCwWU4U+v4lD7uYBw00Ga/xt+7+UqFPlPVdz1yyr4q24Zxaw0LgmuEvgU5dycq8N7JxjTubX0MIRR+G9fmDBBl8=\r\n-----END RSA PRIVATE KEY-----'
  return (req, res, next) => {
    const id = req.body.id
    const user = insecurity.authenticatedUsers.from(req)
    db.reviews.findOne({ _id: id }).then(review => {
      var likedBy = review.likedBy
      if (!likedBy.includes(user.data.email)) {
        db.reviews.update(
          { _id: id },
          { $inc: { likesCount: 1 } }
        ).then(
          result => {
            // Artificial wait for timing attack challenge
            setTimeout(function () {
              db.reviews.findOne({ _id: id }).then(review => {
                var likedBy = review.likedBy
                likedBy.push(user.data.email)
                var count = 0
                for (var i = 0; i < likedBy.length; i++) {
                  if (likedBy[i] === user.data.email) {
                    count++
                  }
                }
                utils.solveIf(challenges.timingAttackChallenge, () => { return count > 2 })
                db.reviews.update(
                  { _id: id },
                  { $set: { likedBy: likedBy } }
                ).then(
                  result => {
                    res.json(result)
                  }, err => {
                    res.status(500).json(err)
                  })
              }, () => {
                res.status(400).json({ error: 'Wrong Params' })
              })
            }, 150)
          }, err => {
            res.status(500).json(err)
          })
      } else {
        res.status(403).json({ error: 'Not allowed' })
      }
    }, () => {
      res.status(400).json({ error: 'Wrong Params' })
    })
  }
}
