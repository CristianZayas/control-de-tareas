/*
  * _id: string,
  * title: string,
  * description: string,
  * status: string,
  * priority: string,
  * createdAt: Date,
*/

const mongoose =  require('mongoose');

const taskSchema =  new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 100
    },
    description : {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 1000
    },
    status: {
        type: String,
        enum: ['pendiente', 'progress','revision','completed','test', 'done','start'],
        default: 'start'
    },
    priority: {
        type: String,
        enum: ['alta', 'media', 'baja'],
        default: 'baja'
    },
    endDate : {
        type: Date,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    completed: {
        type : Boolean,
        default: false
    },
    titleStatus: {
        type : String,
        required: true
    },
    nameProject: {
        type : String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Task',taskSchema);

