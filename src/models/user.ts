import {Schema, model} from "mongoose";
import bcrypt from "bcrypt";
import md5 from "md5";

export interface userInterface{
    readonly userName: String,
    password: String,
    name: String,
    isActive: Boolean,
    age: Number,
    updatePassword(): void
}

const userSchema: Schema = new Schema<userInterface> ({
    userName: {
        type: String,
        required: [true, "UserName is required..."],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required..."]
    },
    name: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    age: {
        type: Number
    }
});

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        // const saltRounds = await bcrypt.genSalt();
        // this.password = await bcrypt.hash(this.password, saltRounds);
        console.log(this.password);
        this.password = <String>md5(this.password);
        console.log(this.password);
    }
    next();
})

// userSchema.path("password").validate(async function(this: userInterface) {
//     const saltRounds = await bcrypt.genSalt();
//     console.log("Validating password");
//     this.password = await <Promise<String>>bcrypt.hash(this.password as string, saltRounds);
// })
export const userModel = model<userInterface>('User', userSchema);