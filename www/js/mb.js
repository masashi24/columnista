// APIキー設定
var applicationKey = '3348ca87569d9bf15ada6d9b17bc828007966bd9219b6d21d03590cac2f785bd';
var clientKey = '738d29f1e3bf103551af5860741dcd2146fcea19eecc41983bde711a747e0e58';
const appId = '1G8kv6O6l0M8VKzJ';

// SDKの初期化
var ncmb = new NCMB(applicationKey, clientKey);

mb = {
    /***** ID/PW認証：新規登録 *****/
    signupByID: function(username, password) { 
        // user インスタンスの生成
        var user = new ncmb.User();
        // ID/PWで新規登録
        user.set('userName', username)
            .set('password', password)
            .signUpByAccount()
            .then(function(user) {
                /* 処理成功 */
                console.log('【ID/PW 認証】新規登録成功');
                // userインスタンスでログイン
                ncmb.User.login(user)
                         .then(function(user) {
                             /* 処理成功 */
                             userSignupSuccess('ログインしました:', user);
                         })
                         .catch(function(error) {
                             /* 処理失敗 */
                             userError('ログイン失敗:', error);
                         });
            })
            .catch(function(error) {
                /* 処理失敗 */
                userError('新規登録失敗:', error);
            });
    },
    /***** ID/PW認証：ログイン *****/
    signinByID: function(username, password) {
        // ID/PWでログイン
        ncmb.User.login(username, password)
                 .then(function(user) {
                     /* 処理成功 */
                     userSuccess('ログインしました:', user);
                 })
                 .catch(function(error) {
                     /* 処理失敗 */
                     userError('ログイン失敗:', error);
                 });
    },
    /***** Email/PW認証：新規登録 *****/
    signupByEmail: function(mailAddress) { 
        // 設定したEmailに会員登録メールを送信
        ncmb.User.requestSignUpEmail(mailAddress)
                 .then(function(user){
                     /* 処理成功 */
                     ons.notification.alert('【Email/PW認証】新規登録メール配信完了')
                                     .then(function(){
                                         ons.notification.alert('届いたメールに記載されているURLにアクセスし、パスワードを登録してください。');
                                     }); 
                     clearField();
                 })
                 .catch(function(error){
                     /* 処理失敗 */
                     userError('【Email/PW認証】新規登録メールの配信に失敗しました:', error);
                     
                 });
    },
    /***** Email/PW認証：ログイン *****/
    signinByEmail: function(mailAddress, password) { 
        // Email/PWでログイン
        ncmb.User.loginWithMailAddress(mailAddress, password)
                 .then(function(user) {
                     /* 処理成功 */
                     userSuccess('【Email/PW認証】ログイン成功:', user);
                 })
                 .catch(function(error) {
                     /* 処理失敗 */
                     userError('【Email/PW認証】ログイン失敗:' + error);
                 });
    },
    /***** 匿名認証：ログイン *****/
    signinByAnonymousID: function(data) { 
        // 匿名でログイン
        ncmb.User.loginAsAnonymous()
                 .then(function(user){
                     /* 処理成功 */
                     userSuccess('【匿名認証】ログイン成功:', user);
                 })
                 .catch(function(error){
                     /* 処理失敗 */
                     userError('【匿名認証】ログイン失敗:' + error);
                 });
    },
    /***** ログアウト *****/
    /*logout: function(data) { 
        // ログアウト
        ncmb.User.logout();
    }/*
    /***** ログアウト *****/
    logout: function(data) { 
        // ログアウト
        ncmb.User.logout();
        _global_loginState = 0
        console.log("login state changed:",_global_loginState);
        ons.notification.alert('ログアウトしました',alertOptions)
        dispLogOutButton(_global_loginState);
        document.querySelector('#pageNavi').popPage();
    }
};