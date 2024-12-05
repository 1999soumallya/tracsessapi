module.exports = {
    commonError: (error) => {
        return { message: 'Internal server error!', success: false, error: error.toString() }
    },
    validationError: (errors) => {
        return { message: "Please fill all mandatory field", success: false, errors: errors }
    },
    middleware: {
        validtoken: "Provide valid token to perform this operation",
        unauthorized: "Your are not authorized to access this platform",
        requiretoken: "Provide valid token to access this platform"
    },
    logout: {
        success: "You are successfully logged out",
        notFound: "Provide valid token for perform this operation",
        failed: "Logout process failed",
    },
    fileupload: {
        success: 'File is successfully uploaded',
        failed: 'File upload process failed'
    },
    useremailcheck: {
        success: true,
        notfound: false,
        failed: "User find process failed",
        without_mail: 'Your email is verified but email is not send',
    },
    role: {
        create: {
            success: "Role created successfully",
            failed: "Role creation process failed, please try after some time",
        },
        update: {
            notFound: "Role is not found provide valid details for update",
            success: "Role updated successfully",
            failed: "Role update process failed, please try after some time",
        },
        removePermission: {
            notFound: "Role is not found provide valid details for remove permission",
            success: "Permission removed successfully",
            failed: "Permission removal process failed, please try after some time",
        },
        toggle: {
            notFound: "Role is not found provide valid details for toggle",
            active: "Role is successfully activated",
            deActive: "Role is successfully deactivated",
            failed: "Role status toggle process failed, please try after some time",
        },
        delete: {
            notFound: "Role is not found provide valid details for delete",
            success: "Role deleted successfully",
            failed: "Role delete process failed, please try after some time",
        },
        getAll: {
            success: "Roles successfully fetched",
            failed: "Roles fetch process failed",
        },
        getSingle: {
            notFound: "Role is not found provide valid details for fetch",
            success: "Role successfully fetched",
            failed: "Role fetch process failed",
        }
    },
    permission: {
        create: {
            success: "Permission created successfully",
            failed: "Permission creation process failed, please try after some time",
        },
        update: {
            notFound: "Permission is not found provide valid details for update",
            success: "Permission updated successfully",
            failed: "Permission update process failed, please try after some time",
        },
        toggle: {
            notFound: "Permission is not found provide valid details for toggle",
            active: "Permission is successfully activated",
            deActive: "Permission is successfully deactivated",
            failed: "Permission status toggle process failed, please try after some time",
        },
        delete: {
            notFound: "Permission is not found provide valid details for delete",
            success: "Permission deleted successfully",
            failed: "Permission delete process failed, please try after some time",
        },
        getAll: {
            success: "Permissions successfully fetched",
            failed: "Permissions fetch process failed",
        },
        getSingle: {
            notFound: "Permission is not found provide valid details for fetch",
            success: "Permission successfully fetched",
            failed: "Permission fetch process failed",
        }
    },
    user: {
        uniqueCheck: {
            success: true,
            notfound: false,
            failed: "User find process failed",
            alreadySended: 'Registration verification code already send please check your mail',
            with_sms: 'OTP Sent to Mobile Number.',
            without_sms: 'OTP send process failed',
            with_mail: 'OTP Sent to E-Mail id.',
            without_mail: 'OTP send process failed',
        },
        verifyEmail: {
            notFound: 'You are not generating your registered code',
            expired: 'Your verification code is expired',
            wrong: 'Your verification code is incorrect',
            verified: 'Your account is already verified',
            success: "Your details is successfully verified",
            failed: "Your account verification process failed, try after sometime",
        },
        register: {
            success: "Your are successfully registered",
            failed: "Your registration process failed",
            notVerified: 'Please verify your mail id for registration',
        },
        forgetPassword: {
            success: "OTP Sent to E-Mail id.",
            mobileSuccess: "OTP Sent to Mobile Number.",
            failed: "User Not Found",
        },
        resetPassword: {
            expired: "Your change password verification code is expired",
            verified: 'Your reset password code is successfully verified',
            verifyFailed: "Your reset password code verification process failed",
            success: "Password Changed Successfully",
            notFound: "Your details are not found provide correct details",
            wrong: "OTP is wrong. Please enter correct otp",
            failed: "Password is not set. Please try again",
            oldPassword: "You can not use old password",
        },
        changePassword: {
            success: "Password Changed Successfully",
            failed: "Password update process failed",
            oldPassword: "You can not use old password",
        },
        login: {
            success: "Login Successful",
            noUser: "Username or Password is Incorrect.",
            notActive: "Your account is not active please activate your account",
            failed: "Login process failed please try after some time",
            wrong: "Wrong Password!",
        },
        updateDetails: {
            success: "Your Profile has is updated.",
            mobileNumber: "This phone number is already connected with different account",
            failed: "Your Profile update process failed",
            noUser: "No user found provide valid details"
        },
    },

    userSync: {
        success: "User sync is completed now",
        failed: "User sync process failed please try after some time",
    },
    getuserdetails: {
        success: "User details is successfully fetched",
        failed: "User details fetch process failed",
        nouser: "No user found for display"
    },
    organizeremailcheck: {
        success: true,
        notfound: false,
        failed: "Organizer find process failed"
    },
    registerOrganizer: {
        success: "You are successfully registered",
        failed: "Your registration process failed",
    },
    loginOrganizer: {
        success: "Login Successful",
        noorganizer: "Username or Password is Incorrect.",
        notactive:
            "Your account is not active please wait for activate your account",
        failed: "Login process failed please try after some time",
        wrong: "Wrong Password!",
    },
    forgetPasswordOrganizer: {
        success: "OTP Sent to E-Mail id.",
        mobileSuccess: "OTP Sent to Mobile Number.",
        failed: "Organizer Not Found",
    },
    resetPasswordOrganizer: {
        success: "Password Changed Successfully",
        wrong: "Token is wrong. Please enter correct token",
        failed: "Password is not set. Please try again",
        oldpassword: "You can not use old password",
    },
    getorganizerdetails: {
        success: "Organizer details is successfully fetched",
        failed: "Organizer details fetch process failed",
        noorganizer: "No organizer found for display"
    },
    updateOrganizer: {
        success: "Organizer details is successfully updated",
        failed: "Organizer details update process failed",
    },
    update: {
        field: (field) => { return `${field} field not be an empty field` },
    },
    event: {
        create: {
            success: "New event is successfully added",
            failed: "Your event creating process failed please try after some time",
            noImage: 'Provide event image for create a new event'
        }
    },

    addEvent: {
        success: (name) => { return `${name} Created Successfully` },
        failed: "Event add process failed",
    },
    updateEvent: {
        success: (name) => { return `${name} Updated Successfully` },
        failed: "Event update process failed",
        update_sessions: "You can not add or update a session for a same time with same name",
        eventnotfound: "Provide valid event id for update the event"
    },
    deleteEvent: {
        success: (name) => { return `${name} Deleted Successfully` },
        failed: "Event delete process failed",
        eventnotfound: "Provide valid event id for delete the event"
    },
    toggleEvent: {
        active: "Event is successfully active",
        deactive: "Event is successfully deactivated",
        failed: "Event active deactive process failed",
        eventnotfound: "Provide valid event id for changing status"
    },
    cancleEvent: {
        success: "Event is successfully cancled",
        failed: "Event cancel process failed",
        already: "Event is already canceled",
        eventnotfound: "Provide valid event id for canceling event"
    },
    singleEvent: {
        success: "Event details successfully fetched",
        failed: "Event details fetch process failed",
        noEvent: "Event is not found select correct event id to get details"
    },
    getEvent: {
        success: "All event are successfully fetched",
        failed: "Event fetch process failed",
        noEvent: "No event found for display"
    },
    getEventName: {
        success: "All event name are successfully fetched",
        failed: "Event name fetch process failed",
        noEvent: "No event name found for display"
    },
    bookEvent: {
        noevent: "This event details is not found choose correct one",
        nosessiong: (session) => { return `${session} session is not accept for this event choose correct one` },
        notcurrent: (session) => { return `${session} session is not active now choose active one` },
        noslot: (vehicleCategory) => { return `${vehicleCategory} is full you can not book this vehicle category` },
        notvehiclecategory: (vehicleCategory, session) => { return `${vehicleCategory} vehicle category is not available for ${session} session` },
        notsuooprtedvehicle: (vehicle, session) => { return `${vehicle} is not supported for ${session} session` },
        duration: (vehicleCategory) => { return `Duraction is required for ${vehicleCategory} vehicle category` },
        requestvalidatefailed: "Booking validation process failed please try after some time",
        success: "Event is successfully booked",
        failed: "Event booking process failed"
    },
    getAllBookings: {
        success: 'All booking details are successfully fetched',
        failed: 'Booking details fetch process failed'
    },
    getSingleBookings: {
        notfound: 'Booking details is not found provide valid booking id',
        success: 'Booking details is successfully fetched',
        failed: 'Booking details fetch process failed'
    },
    deleteSingleName: {
        success: "Event name are successfully deleted",
        failed: "Event name delete process failed",
        noEvent: "No event name found select valid event name"
    },
    deleteEventName: {
        success: "All event name are successfully deleted",
        failed: "Event name delete process failed",
        noEvent: "No event name found select valid event name"
    },
    addSession: {
        success: "Session is successfully added",
        failed: "Session add process failed",
        eventnotfound: "Provide valid event id for create a session"
    },
    updateSession: {
        success: "Session is successfully updated",
        failed: "Session update process failed",
        notfound: "Provide valid session id"
    },
    deleteSession: {
        success: "Session is successfully deleted",
        failed: "Session delete process failed",
        notfound: "Provide valid session id"
    },
    deleteMultipleSession: {
        success: "Multiple sessions are successfully deleted",
        failed: "Multiple sessions delete process failed",
        nosession: "No session found select valid session id"
    },
    toggleSession: {
        active: "Session is now active",
        deactive: "Session is now deactivated",
        failed: "Session active de active process failed",
        notfound: "Provide valid session id"
    },
    getSession: {
        success: "All session are successfully fetched",
        failed: "Session fetch process failed",
        noSession: "No session found for display"
    },
    addVehicle: {
        success: "Vehicle is successfully added",
        failed: "Vehicle add process failed",
    },
    updateVehicle: {
        success: "Vehicle is successfully updated",
        failed: "Vehicle update process failed",
        novehicle: "No vehicle found"
    },
    deleteVehicle: {
        success: "Vehicle is successfully deleted",
        failed: "Vehicle delete process failed",
        novehicle: "No vehicle found"
    },
    getVehicle: {
        success: "All vehicle are successfully fetched",
        failed: "Vehicle fetch process failed",
        noVehicle: "No vehicle found for display"
    },
    getSingleVehicle: {
        success: "Vehicle details successfully fetched",
        failed: "Vehicle details fetch process failed",
        noVehicle: "No vehicle found"
    },
    toggleVehicle: {
        active: "Vehicle is now active",
        deactive: "Vehicle is now deactivated",
        failed: "Vehicle active deactive process failed",
    },
    getRiderVehicle: {
        noSession: 'This session is not available provide valid session id for get vehicle',
        noRider: "This user is not found provide valid rider id",
        notAvailable: "This rider is not available for this event or not accept your invite or not invited",
        success: "Rider all vehicles are successfully fetched",
        failed: "Rider vehicle fetch process failed",
    },
    addVehicleCategory: {
        success: "Vehicle Category is successfully added",
        failed: "Vehicle Category add process failed"
    },
    updateVehicleCategory: {
        success: "Vehicle Category is successfully updated",
        failed: "Vehicle Category update process failed"
    },
    deleteVehicleCategory: {
        success: "Vehicle Category is successfully deleted",
        failed: "Vehicle Category delete process failed"
    },
    toggleVehicleCategory: {
        active: "Vehicle Category is now active",
        deactive: "Vehicle Category is now deactivated",
        failed: "Vehicle Category active deactive process failed"
    },
    addVehicleType: {
        success: 'New vehicle type is created',
        failed: 'Vehicle type create process failed'
    },
    getAllVehicleType: {
        success: 'All vehicle types are successfully fetched',
        failed: 'Vehicle type fetch process failed'
    },
    deleteVehicleType: {
        success: 'Vehicle types are successfully deleted',
        failed: 'Vehicle type delete process failed'
    },
    addPeriod: {
        success: 'New period is successfully added',
        failed: 'Period create process failed'
    },
    getPeriod: {
        success: 'All periods are successfully fetched',
        failed: 'Period fetch process failed'
    },
    singlePeriod: {
        success: 'Period details successfully fetched',
        failed: 'Period fetch process failed'
    },
    tooglePeriod: {
        active: 'Period details activated',
        deactive: 'Period details deactivated',
        notfound: 'Period details is not found provide correct one',
        failed: 'Period fetch process failed'
    },
    deletePeriod: {
        success: 'Period is successfully deleted',
        notfound: 'Period details is not found provide correct one',
        failed: 'Period fetch process failed'
    },
    specializationCategory: {
        create: {
            success: "Specialization Category is successfully added",
            failed: "Specialization Category add process failed"
        },
        update: {
            success: "Specialization Category is successfully updated",
            failed: "Specialization Category update process failed"
        },
        delete: {
            success: "Specialization Category is successfully deleted",
            failed: "Specialization Category delete process failed",
            notfound: "Specialization Category is not found provide correct one"
        },
        toggle: {
            active: "Specialization Category is now active",
            deactive: "Specialization Category is now deactivated",
            failed: "Specialization Category active deactive process failed",
            notfound: "Specialization Category is not found provide correct one"
        },
        getAll: {
            success: "All specialization categories are successfully fetched",
            failed: "Specialization Category fetch process failed"
        },
        getSingle: {
            success: "Specialization Category details successfully fetched",
            failed: "Specialization Category details fetch process failed",
            notfound: "Specialization Category is not found provide correct one"
        }
    },
    designation: {
        create: {
            success: "Designation is successfully added",
            failed: "Designation add process failed"
        },
        update: {
            success: "Designation is successfully updated",
            failed: "Designation update process failed"
        },
        delete: {
            success: "Designation is successfully deleted",
            failed: "Designation delete process failed",
            notfound: "Designation is not found provide correct one"
        },
        toggle: {
            active: "Designation is now active",
            deactive: "Designation is now deactivated",
            failed: "Designation active deactive process failed",
            notfound: "Designation is not found provide correct one"
        },
        getAll: {
            success: "All designations are successfully fetched",
            failed: "Designation fetch process failed"
        },
        getSingle: {
            success: "Designation details successfully fetched",
            failed: "Designation details fetch process failed",
            notfound: "Designation is not found provide correct one"
        }
    },
    tuners: {
        uniqueCheck: {
            found: true,
            notfound: false,
            failed: "Tuners find process failed",
            alreadySended: 'Registration verification code already send please check your mail',
            with_sms: 'OTP Sent to Mobile Number.',
            without_sms: 'OTP send process failed',
            with_mail: 'OTP Sent to E-Mail id.',
            without_mail: 'OTP send process failed',
        },
        register: {
            notVerified: 'Please verify your mail id for registration',
            success: 'Your are successfully registered',
            failed: "Your register process failed"
        },
        verifyEmail: {
            notFound: 'You are not generating your registered code',
            expired: 'Your verification code is expired',
            wrong: 'Your verification code is incorrect',
            verified: 'Your account is already verified',
            success: "Your details is successfully verified",
            failed: "Your account verification process failed, try after sometime",
        },
        login: {
            success: "You are successfully Login",
            noTuners: "Username or Password is Incorrect.",
            notActive: "Your account is not active please activate your account",
            failed: "Login process failed please try after some time",
            wrong: "Wrong Password!",
        },
        forgetPassword: {
            success: "OTP Sent to E-Mail id.",
            mobileSuccess: "OTP Sent to Mobile Number.",
            failed: "Tuner Not Found",
        },
        resetPassword: {
            expired: "Your change password verification code is expired",
            verified: 'Your reset password code is successfully verified',
            verifyFailed: "Your reset password code verification process failed",
            success: "Password Changed Successfully",
            notFound: "Your details are not found provide correct details",
            wrong: "OTP is wrong. Please enter correct otp",
            failed: "Password is not set. Please try again",
            oldPassword: "You can not use old password",
        },
        changePassword: {
            success: "Password Changed Successfully",
            failed: "Password update process failed",
            oldPassword: "You can not use old password",
        },
        getDetails: {
            success: "Tuner details is successfully fetched",
            failed: "Tuner details fetch process failed",
            noTuner: "No tuner found for display"
        },
        updateDetails: {
            success: "Your Profile has is updated.",
            failed: "Your Profile update process failed",
            mobileNumber: "This phone number is already connected with different account",
            noTuner: "No tuner found for display"
        },
    },
    crewMembers: {
        added: {
            permanent: (name) => `Invitation has been sent to ${name} to join your Crew`,
            temporary: (name, event_name) => `Invitation has been sent to ${name} to join your Event “${event_name}”`,
            exists: 'This tuner is already exists provide tuner id',
            alreadyInvited: 'This crew member is already invited for your crew',
            success: "Crew member is successfully added",
            failed: "Crew member add process failed",
            notfound: "Crew member is not found provide correct member ship identifier",
            eventNotFound: "This event is not present provide correct event"
        },
        remove: {
            success: (name) => `${name} has been removed from your Permanent Crew Member `,
            failed: "Crew member remove process failed",
            notfound: "Crew member is not found provide correct member ship identifier"
        },
        accept: {
            success: (owner) => { return `You are successfully joined to ${owner} team` },
            notValid: 'Your invitation is not valid provide valid invitation identifier',
            owner: 'You cannot accept yourself to your group',
            notExists: 'Your invitation creator is not available',
            failed: "Your joining process failed",
            notfound: "Your invitation is expired"
        },
        decline: {
            success: (owner) => { return `You are successfully decline ${owner} team invitation` },
            notValid: 'Your invitation is not valid provide valid invitation identifier',
            owner: 'You cannot decline yourself to your group',
            notExists: 'Your invitation creator is not available',
            failed: "Your decline process failed",
            notfound: "Your invitation is expired"
        },
        resend: {
            notfound: 'Invite this person first',
            joined: "He/She is already joined in your group",
            decline: "He/She is already decline to joined in your group",
            success: "Your invitation is resent successfully",
            failed: "Your invitation resend process failed",
        },
        getMembers: {
            success: "All crew members are successfully fetched",
            failed: "Crew member fetch process failed",
            noMember: "No crew member found for display"
        },
        getSingleMember: {
            success: "Crew member details successfully fetched",
            failed: "Crew member details fetch process failed",
            notfound: "No crew member found for display"
        },
        searchMembers: {
            success: "All tuners are successfully fetched",
            failed: "Tuner fetch process failed",
            noTuner: "No tuner found for display"
        },
        getAllTeam: {
            success: "All teams are successfully fetched",
            failed: "Team fetch process failed",
            noTeam: "No team found for display"
        }
    },
    riderMembers: {
        added: {
            success: "Rider is successfully added",
            failed: "Rider add process failed",
            exists: "Rider is already exist in your group",
            notfound: "Rider is not found provide correct one",
            notevent: "Event is not found provide correct one"
        },
        remove: {
            success: "Rider is successfully removed",
            failed: "Rider remove process failed",
            notfound: "Rider is not found provide correct member ship identifier"
        },
        accept: {
            success: (owner) => { return `You are successfully joined to ${owner} team` },
            notValid: 'Your invitation is not valid provide valid invitation identifier',
            owner: 'You cannot accept yourself to your group',
            notExists: 'Your invitation creator is not available',
            failed: "Your joining process failed",
            notfound: "Your invitation is expired"
        },
        resend: {
            notfound: 'Invite this person first',
            joined: "He/She is already joined in your group",
            success: "Your invitation is resent successfully",
            failed: "Your invitation resend process failed",
        },
        get: {
            success: "All riders are successfully fetched",
            failed: "Rider fetch process failed",
            noRiders: "No riders found for display"
        },
        getSingle: {
            success: "Rider details successfully fetched",
            failed: "Rider details fetch process failed",
            notfound: "Rider is not found provide correct one"
        },
        search: {
            success: "All riders are successfully fetched",
            failed: "Rider fetch process failed"
        },
        sessionRiders: {
            notFound: "Provide correct session details",
            noRiders: "No riders found add some riders for display",
            success: "All riders details are successfully fetched",
            failed: "Session riders fetch process failed"
        }
    },
    relations: {
        create: {
            success: "Relation is successfully added",
            failed: "Relation add process failed"
        },
        update: {
            success: "Relation is successfully updated",
            failed: "Relation update process failed",
            notfound: "Relation is not found provide correct one"
        },
        delete: {
            success: "Relation is successfully deleted",
            failed: "Relation delete process failed",
            notfound: "Relation is not found provide correct one"
        },
        toggle: {
            active: "Relation is now active",
            deactive: "Relation is now deactivated",
            failed: "Relation active deactive process failed",
            notfound: "Relation is not found provide correct one"
        },
        getAll: {
            success: "All relations are successfully fetched",
            failed: "Relation fetch process failed"
        },
        getSingle: {
            success: "Relation details successfully fetched",
            failed: "Relation details fetch process failed",
            notfound: "Relation is not found provide correct one"
        }
    },
    gender: {
        create: {
            success: "Gender is successfully added",
            failed: "Gender add process failed"
        },
        update: {
            success: "Gender is successfully updated",
            failed: "Gender update process failed",
            notfound: "Gender is not found provide correct one"
        },
        delete: {
            success: "Gender is successfully deleted",
            failed: "Gender delete process failed",
            notfound: "Gender is not found provide correct one"
        },
        toggle: {
            active: "Gender is now active",
            deactive: "Gender is now deactivated",
            failed: "Gender active deactive process failed",
            notfound: "Gender is not found provide correct one"
        },
        getAll: {
            success: "All genders are successfully fetched",
            failed: "Gender fetch process failed"
        },
        getSingle: {
            success: "Gender details successfully fetched",
            failed: "Gender details fetch process failed",
            notfound: "Gender is not found provide correct one"
        },
    },
    track: {
        create: {
            success: "Track is successfully added",
            failed: "Track add process failed"
        },
        update: {
            success: "Track is successfully updated",
            failed: "Track update process failed",
            notfound: "Track is not found provide correct one"
        },
        delete: {
            success: "Track is successfully deleted",
            failed: "Track delete process failed",
            notfound: "Track is not found provide correct one"
        },
        toggle: {
            active: "Track is now active",
            deactive: "Track is now deactivated",
            failed: "Track active deactive process failed",
            notfound: "Track is not found provide correct one"
        },
        getAll: {
            success: "All tracks are successfully fetched",
            failed: "Track fetch process failed"
        },
        getSingle: {
            success: "Track details successfully fetched",
            failed: "Track details fetch process failed",
            notfound: "Track is not found provide correct one"
        },
    },
    weather: {
        create: {
            success: "Weather is successfully added",
            failed: "Weather add process failed"
        },
        update: {
            success: "Weather is successfully updated",
            failed: "Weather update process failed",
            notfound: "Weather is not found provide correct one"
        },
        delete: {
            success: "Weather is successfully deleted",
            failed: "Weather delete process failed",
            notfound: "Weather is not found provide correct one"
        },
        toggle: {
            active: "Weather is now active",
            deactive: "Weather is now deactivated",
            failed: "Weather active deactive process failed",
            notfound: "Weather is not found provide correct one"
        },
        getAll: {
            success: "All weathers are successfully fetched",
            failed: "Weather fetch process failed"
        },
        getSingle: {
            success: "Weather details successfully fetched",
            failed: "Weather details fetch process failed",
            notfound: "Weather is not found provide correct one"
        }
    },
    trackCondition: {
        create: {
            success: "Track condition is successfully added",
            failed: "Track condition add process failed"
        },
        update: {
            success: "Track condition is successfully updated",
            failed: "Track condition update process failed",
            notfound: "Track condition is not found provide correct one"
        },
        delete: {
            success: "Track condition is successfully deleted",
            failed: "Track condition delete process failed",
            notfound: "Track condition is not found provide correct one"
        },
        toggle: {
            active: "Track condition is now active",
            deactive: "Track condition is now deactivated",
            failed: "Track condition active deactive process failed",
            notfound: "Track condition is not found provide correct one"
        },
        getAll: {
            success: "All track conditions are successfully fetched",
            failed: "Track condition fetch process failed"
        },
        getSingle: {
            success: "Track condition details successfully fetched",
            failed: "Track condition details fetch process failed",
            notfound: "Track condition is not found provide correct one"
        }
    },
    direction: {
        create: {
            success: "Direction is successfully added",
            failed: "Direction add process failed"
        },
        update: {
            success: "Direction is successfully updated",
            failed: "Direction update process failed",
            notfound: "Direction is not found provide correct one"
        },
        delete: {
            success: "Direction is successfully deleted",
            failed: "Direction delete process failed",
            notfound: "Direction is not found provide correct one"
        },
        toggle: {
            active: "Direction is now active",
            deactive: "Direction is now deactivated",
            failed: "Direction active deactive process failed",
            notfound: "Direction is not found provide correct one"
        },
        getAll: {
            success: "All direction are successfully fetched",
            failed: "Direction fetch process failed"
        },
        getSingle: {
            success: "Direction details successfully fetched",
            failed: "Direction details fetch process failed",
            notfound: "Direction is not found provide correct one"
        }
    },
    notification: {
        getAll: {
            success: "All notifications are successfully fetched",
            failed: "Notification fetch process failed"
        },
        getSingle: {
            success: "Notification details successfully fetched",
            failed: "Notification details fetch process failed",
            notfound: "Notification is not found provide correct one"
        },
        makeRead: {
            success: "Notification is now read",
            failed: "Notification read process failed",
            notfound: "Notification is not found provide correct one"
        }
    },
    sessionSetup: {
        create: {
            success: (name) => { return `Session setup ${name} created successfully` },
            failed: "Session setup add process failed"
        },
        update: {
            success: (name) => { return `Session setup ${name} updated successfully` },
            failed: "Session setup update process failed",
            notfound: "Session setup is not found provide correct one"
        },
        delete: {
            success: "Session setup is successfully deleted",
            failed: "Session setup delete process failed",
            notfound: "Session setup is not found provide correct one"
        },
        toggle: {
            active: "Session setup is now active",
            deactive: "Session setup is now deactivated",
            failed: "Session setup active deactive process failed",
            notfound: "Session setup is not found provide correct one"
        },
        get: {
            success: "Session setup details successfully fetched",
            failed: "Session setup details fetch process failed",
            notfound: "Session setup is not found provide correct one"
        },
        cloneSetup: {
            notfound: 'Session setup is not found provide correct one',
            success: (name) => { return `Session setup ${name} cloned successfully` },
            failed: "Session setup clone process failed",
        },
        cloneSetupForSession: {
            success: (name, sessionName) => { return `Session setup ${name} cloned successfully for ${sessionName}` },
            failed: "Session setup clone process failed",
            notfound: 'Session is not found provide correct one',
            noSetup: 'No setup found for this session'
        },
        rider: {
            added: 'New rider successfully added for this setup',
            removed: 'Rider successfully removed from this setup',
            failed: 'Rider add/remove process failed',
            notfound: 'Rider is not found provide correct one',
            already_added: 'Rider already added for this setup'
        },
        vehicle: {
            added: 'New vehicle successfully added for this setup',
            removed: 'Vehicle successfully removed from this setup',
            update: 'Vehicle is successfully updated for this setup',
            failed: 'Vehicle add/remove process failed',
            notfound: 'Vehicle is not found provide correct one',
            already_added: 'Vehicle already added for this setup'
        }
    },
    vehicleSetup: {
        create: {
            notFound: 'Details is not found provide valid one',
            success: (name) => { return `Vehicle setup ${name} created successfully` },
            failed: "Vehicle setup add process failed"
        },
        update: {
            success: (name) => { return `Vehicle setup ${name} updated successfully` },
            failed: "Vehicle setup update process failed",
            notfound: "Vehicle setup is not found provide correct one"
        },
        delete: {
            success: "Vehicle setup is successfully deleted",
            failed: "Vehicle setup delete process failed",
            notfound: "Vehicle setup is not found provide correct one"
        },
        get: {
            success: "Vehicle setup details successfully fetched",
            failed: "Vehicle setup details fetch process failed",
            notfound: "Vehicle setup is not found provide correct one"
        },
        getSingle: {
            success: "Vehicle setup details successfully fetched",
            failed: "Vehicle setup details fetch process failed",
            notfound: "Vehicle setup is not found provide correct one"
        }
    },
    laps: {
        create: {
            notfound: 'Vehicle setup is not found',
            exists: 'You can not use same lap times for multiple',
            success: "Lap is successfully added",
            failed: "Lap add process failed"
        },
        get: {
            success: "Lap details successfully fetched",
            failed: "Lap details fetch process failed",
        }
    },
    suspensionSettings: {
        create: {
            success: "Suspension settings is successfully added",
            failed: "Suspension settings add process failed"
        },
        update: {
            success: "Suspension settings is successfully updated",
            failed: "Suspension settings update process failed",
            notfound: "Suspension settings is not found provide correct one"
        },
        delete: {
            success: "Suspension settings is successfully deleted",
            failed: "Suspension settings delete process failed",
            notfound: "Suspension settings is not found provide correct one"
        },
        toggle: {
            active: "Suspension settings is now active",
            deactive: "Suspension settings is now deactivated",
            failed: "Suspension settings active deactive process failed",
            notfound: "Suspension settings is not found provide correct one"
        },
        getAll: {
            success: "All suspension settings are successfully fetched",
            failed: "Suspension settings fetch process failed"
        },
    }
};