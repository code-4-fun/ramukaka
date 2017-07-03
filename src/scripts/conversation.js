var request = require('request');

const questionData = [
    {
        'question': 'hello|hey there|こにちわ|wassup$/i',
        'answer': 'Hey there...'
    },
    {
        'question': /what is your name|おなまえわなんですか|name/,
        'answer': ['Hey, I am Devendra']
    },
    {
        'question': /how are you|お元気ですか/,
        'answer': ['Yeah, I am doing pretty good']
    },
    {
        'question': /age|birthdate/,
        'answer': [
            "My birthdate is 13th February 1986.",
            "I am 31 years old!"
        ]
    }
];

var conversation = function(robot) {
    questionData.forEach(function(data) {
        robot.hear(data.question, function(res) {
            if (Array.isArray(data.answer)) {
                data.answer.forEach(function(ans, index) {
                    setTimeout(function() {
                        res.emote(ans);
                    }, 3000 * index);
                });
            } else {
                res.emote(data.answer);
            }
        });
    });
}

module.exports = conversation;
