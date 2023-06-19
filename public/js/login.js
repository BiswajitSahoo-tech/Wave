import axios from "axios"
import { showAlerts } from './alerts'

export const login = async  ( email , password) =>{
    
    try{
        const res = await axios( {
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email , 
                password
            }
           })

        
           if( res.data.status === 'success' ){
            showAlerts('success' , 'Logged in successfully')
            // alert('success')

            window.setTimeout( ()=>{
                location.assign('/')
            } , 1500)
           }
        //    console.log( res)
    } catch( err){
        showAlerts( 'error' , 'Incorrect Details')
        // alert('fail')
    }
   
}

export const logout = async ()=>{
    try{

        const active_res = await axios( {
            method: 'PATCH',
            url: '/api/v1/users/active',
            data: {
                active : false
            }
        })
        
        const res = await axios( {
            method: 'GET',
            url: '/api/v1/users/logout',
            
        })
        
        if( res.data.status === 'success' && active_res.data.status === 'success')
            location.reload(true)// true is required becuz we want a page from server not from cache
    } catch ( err){
        showAlerts('error', 'try again')
    }
}

export const signup = async ( name, email,peerId, bio, interest, password, passwordConfirm)=>{
    try{
        const res = await axios( {
            method: 'POST',
            url: '/api/v1/users/signup',
            data: {
                email , 
                name,
                peerId,
                bio,
                interest,
                password,
                passwordConfirm
            }
           })

           
           if( res.data.status === 'success'){
            showAlerts('success' , 'Sign up successfully')
            // alert('success')
            window.setTimeout( ()=>{
                location.assign('/')
            } , 1500)
           }
           console.log( res.data)
    } catch( err){
        console.log(err)
        showAlerts( 'error' , 'Incorrect Details')
        // alert('fail')
    }
}

