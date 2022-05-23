// grobal variables for my app
var _global_loginState = 0; //1:log in 0:log out
var _global_chartViewState = 0; //1:viewing 0:not viewing
var _global_chartListViewState = 0;
var loginUser = null;
var twitter;
var instagram;

var alertOptions = {
      title: ''
  };

// 画面表示関係
function dispLogOutButton(flag){
  // 要素を取得
  logOutButton =document.getElementById("logOutButton");
  // hidden に設定して非表示
  if(flag == 0){
    logOutButton.style.visibility = 'hidden';
  }
  // display に設定して表示
  else{
    logOutButton.style.visibility = 'visible';
  }
  console.log("logOutButton:",logOutButton.style.visibility);
}

// for myPage.js
const $qs = (name) => document.querySelector(name);

// dataURIをBlobに変換する関数
const toBlob = (dataURI) => {
    const byteString = atob( dataURI.split( "," )[1] ) ;
    const mimeType = dataURI.match( /(:)([a-z\/]+)(;)/ )[2] ;
    for( var i=0, l=byteString.length, content=new Uint8Array( l ); l>i; i++ ) {
        content[i] = byteString.charCodeAt( i ) ;
    }
    return new Blob( [ content ], {
        type: mimeType ,
    }) ;
}

/********** ID/PW認証 **********/
// 「Sing up」ボタン押下時の処理
function onSignupByIDBtn() {
    var username = $('#singupUsername').val();
    var password = $('#singupPassword').val();
    var passwordConfirm = $('#singupPasswordConfirm').val();
    if(username == '' || password == '' || passwordConfirm == '') {
        ons.notification.alert('入力されていない項目があります');
    }
    else if (! username.match(/^[A-Za-z0-9]*$/)) {
        ons.notification.alert('使用できない文字列が含まれてます');
    } 
    else if (password != passwordConfirm) {
        ons.notification.alert('パスワードが不一致です');
    }
    else if (password.length < 6) {
        ons.notification.alert('パスワードが短すぎます');
    } else {
        mb.signupByID(username, password);
    }
}

// 「Sing in」ボタン押下時の処理
function onSigninByIDBtn() { 
    var username = $('#singinUsername').val();
    var password = $('#singinPassword').val();
    if(username == '' || password == '') {
        ons.notification.alert('入力されていない項目があります');
    } else {
        mb.signinByID(username, password);
    }
}


/********** メールアドレス / PW 認証 **********/
// 「Sing up」ボタン押下時の処理
function onSignupByEmailBtn() {
    var mailAddress = $('#singupEmailAddress').val();
    if(mailAddress == '') {
        ons.notification.alert('メールアドレスが入力されていません');
    } else {
        mb.signupByEmail(mailAddress);
    }
}

// 「Sing in」ボタン押下時の処理
function onSigninByEmailBtn() {
    var mailAddress = $('#singinEmailAddress').val();
    var password = $('#singinEmailAddressPW').val();
    if(mailAddress == '' || password == '') {
        ons.notification.alert('入力されていない項目があります');
    } else {
        mb.signinByEmail(mailAddress, password);
    }
}

/********** 匿名認証**********/
// 「Sing in」ボタン押下時の処理
function onSigninByAnonymousIDBtn() {
    mb.signinByAnonymousID();
}

/********** コールバック **********/
// 成功
//function userSuccess(message, user) {
    /* 処理成功 */
/*    console.log(message + ' ' + JSON.stringify(user));
    objectId = user.get('objectId');
    ons.notification.alert(message + ' objectId: ' + objectId)
                    .then(function() {
                        mb.logout();
                        ons.notification.alert('ログアウトしました');
                    });
    clearField();
}

// 失敗
function userError(message, error) {
    console.log(message + ' ' + error);
    ons.notification.alert(message + ' ' + error);
}*/

function userSuccess(message, user) {
    /* 処理成功 */
    console.log(message + ' ' + JSON.stringify(user));
    objectId = user.get('objectId');
    //ons.notification(message + ' objectId: ' + objectId)
    ons.notification.toast(message, {
      timeout: 2000
    });
    clearField();

    //add log in state for my app
    _global_loginState = 1 // 1:log in 0:log out
    console.log("login state changed:",_global_loginState);

    //pageNavi.pushPage("02_myPage.html");
    //document.querySelector('#pageNavi').pushPage('02_mainPage.html');
    document.querySelector('#pageNavi').pushPage('02_mainPage.html');
    dispLogOutButton(_global_loginState);
    loginUser = ncmb.User.getCurrentUser().get("userName");
}

function userSignupSuccess(message, user) {
    /* 処理成功 */
    console.log(message + ' ' + JSON.stringify(user));
    objectId = user.get('objectId');
    //ons.notification(message + ' objectId: ' + objectId)
    ons.notification.toast(message, {
      timeout: 2000
    });
    clearField();

    //add log in state for my app
    _global_loginState = 1 // 1:log in 0:log out
    console.log("login state changed:",_global_loginState);

    //pageNavi.pushPage("02_myPage.html");
    //document.querySelector('#pageNavi').pushPage('02_mainPage.html');
    document.querySelector('#pageNavi').pushPage('02_mainPage.html');
    dispLogOutButton(_global_loginState);
    createEmptyProfile();
    loginUser = ncmb.User.getCurrentUser().get("userName");
}

// 失敗
function userError(message, error) {
    console.log(message + ' ' + error);
    //ons.notification.alert(message + ' ' + error, alertOptions);
    ons.notification.alert("ログインに失敗しました。\nIDとPasswordを確認してください。\n新規登録の場合は別のIDをお試しください。", alertOptions);
}

// クリア
function clearField() {
    $('#singupUsername').val('');
    $('#singupPassword').val('');
    $('#singupPasswordConfirm').val('');
    $('#singinUsername').val('');
    $('#singinPassword').val('');
    $('#singupEmailAddress').val('');
    $('#singinEmailAddress').val('');
    $('#singinEmailAddressPW').val('');
}

function openSNS(snsLinkButton) {
  var link = snsLinkButton.getAttribute("link");
  cordova.InAppBrowser.open(link, '_blank', 'location=yes');
}

// マイ投稿保存
function savePost(){

  var Post = ncmb.DataStore("post");
  var Profile = ncmb.DataStore("profile");
  var postOwner = ncmb.User.getCurrentUser().get("userName");
  var postTitle = $('#postTitle').val();
  var postContent = $('#postContent').val();
  var saveDate = Date.now();

  if(postTitle == '' || postContent == '') {
    ons.notification.alert('入力されていない項目があります');
  } 

  else{
    try{
      Profile.equalTo("owner", postOwner)
           .fetchAll()
           .then(function(results){
              if(results.length != 0){
                for (var i = 0; i < results.length; i++) {
                  var object = results[i];
                }
                var postOwnerObjId = object.objectId;
                var post = new Post();
                // mBaaSへのアップロード処理    
                post.set("owner", postOwner);
                post.set("title", postTitle);
                post.set("content", postContent);
                post.set("saveDate", saveDate);
                post.set("userObjectId", postOwnerObjId);
                post.set("good", 0);
                post.save();
                console.log("profile saved");
                $('#postTitle').val("");
                $('#postContent').val("");
                ons.notification.toast('Success!', {
                  timeout: 2000
                });
                var mainTabBar = $qs("ons-tabbar");
                mainTabBar.setActiveTab(0);
              }
              else{
                ons.notification.alert('先にマイページの入力をお願いします');
              }
           });
    }
    catch (e) {
      // 失敗したらエラーを表示
      console.log(e);
      ons.notification.toast('保存に失敗しました', {
        timeout: 2000
      });
    }
  }
}
  /*try {
    Profile.equalTo("owner", pageOwner)
           .fetchAll()
           .then(function(results){
              if(results.length != 0){
                for (var i = 0; i < results.length; i++) {
                  var object = results[i];
                }
                object.set("owner", pageOwner);
                object.set("profileMessage", profileMessage);
                object.set("fileName", fileName);
                object.update();
                console.log("updated");
                ons.notification.alert("更新しました",alertOptions)
                }
              else{
                  var profile = new Profile();
                  // mBaaSへのアップロード処理    

                  profile.set("owner", pageOwner);
                  profile.set("profileMessage", profileMessage);
                  profile.set("fileName", fileName);

                  profile.save();
                  console.log("profile saved");
                  ons.notification.alert("新規保存しました",alertOptions)
                }
              })
  }
  catch (e) {
    // 失敗したらエラーを表示
    console.log(e);
  }
}*/

// 初期マイページ作成
function createEmptyProfile(){
  console.log("creating empty mypage");
  var Profile = ncmb.DataStore("profile");
  var pageOwner = ncmb.User.getCurrentUser().get("userName");
  
  try {
    Profile.equalTo("owner", pageOwner)
           .fetchAll()
           .then(function(results){
              var profile = new Profile();
              // mBaaSへのアップロード処理    
              var newFileName = "no_image.png";
              profile.set("owner", pageOwner);
              profile.set("profileMessage", null);
              profile.set("fileName", newFileName);
              profile.set("likeList", []);
              profile.set("twitter", null);
              profile.set("instagram", null);
              profile.save();
            })
  }
  catch (e) {
    // 失敗したらエラーを表示
    console.log(e);
  }
}

// マイページ保存
function saveProfile(){
  var Profile = ncmb.DataStore("profile");
  var pageOwner = ncmb.User.getCurrentUser().get("userName");
  var profileMessage = document.getElementById('profileMessage').value;
  console.log(profileMessage);
  var fileName = $qs('#name').innerText;
  console.log(fileName);
  
  try {
    Profile.equalTo("owner", pageOwner)
           .fetchAll()
           .then(function(results){
              if(results.length != 0){
                for (var i = 0; i < results.length; i++) {
                  var object = results[i];
                }
                if(fileName){
                  deleteFile(object.fileName);
                  var newFileName = saveImageFile(pageOwner);
                }
                object.set("owner", pageOwner);
                object.set("profileMessage", profileMessage);
                object.set("fileName", newFileName);
                object.update();
                console.log("updated");
                ons.notification.alert("更新しました",alertOptions)
                }
              else{
                  var profile = new Profile();
                  // mBaaSへのアップロード処理    
                  var newFileName = saveImageFile(pageOwner);
                  profile.set("owner", pageOwner);
                  profile.set("profileMessage", profileMessage);
                  profile.set("fileName", newFileName);
                  profile.set("fileName", newFileName);
                  profile.set("likeList", []);
                  profile.save();
                  console.log("profile saved");
                  ons.notification.alert("新規保存しました",alertOptions)
                }
              })
  }
  catch (e) {
    // 失敗したらエラーを表示
    console.log(e);
  }
}

function deleteFile(fileName){
  try{
    ncmb.File.delete(fileName);
    console.log("deleted")
  }
  catch (e) {
    // 失敗したらエラーを表示
    console.log(e);
  }
}

function saveImageFile(pageOwner){
// ファイル名を取得
  //const fileName = $('#name').innerText;
  var fileName = Date.now() + "_" + pageOwner + ".jpg";
  console.log("fileName=",fileName);
  // dataURIになっている画像リソースを取得
  var dataURI = $qs('#preview img').src;
  console.log(dataURI);
  // dataURIをBlobに変換する
  var blob = toBlob(dataURI);
  try {
    //$qs('#result').innerText = 'アップロード中…';
    // ファイルアップロード処理
    ncmb.File.upload(fileName, blob);
    //$qs('#result').innerText = '成功';
    // 完了したらHTTPSアクセスで画像表示
    //$qs('#mbaas img').src = `https://mbaas.api.nifcloud.com/2013-09-01/applications/${appId}/publicFiles/${fileName}`;
  } 
  catch (e) {
    // 失敗したらエラーを表示
    $qs('#result').innerText = '失敗';
    console.log(e);
  }
  return fileName;
}



var dataIsEmpty = 1; // "1": not registered yet / "0": data is registered
function createHolo(){

  var Holo = ncmb.DataStore("Holoscope");
  
  var holoOwner = ncmb.User.getCurrentUser().get("userName");
  var year = $('#year').val();
  var month = $('#month').val();
  var date = $('#date').val();
  var hour = $('#hour').val();
  var min = $('#min').val();
  var longitude = $('#longitude').val();
  var latitude = $('#latitude').val();

  if(year == '' || month == '' || date == '' || 
          hour == '' || min == '' || longitude == '' || latitude == '' ) {
            ons.notification.alert('入力されていない項目があります');
  } 
  else {
    if(dataIsEmpty == 1){
      try {
          var holo = new Holo();
          // mBaaSへのアップロード処理    

          holo.set("owner", holoOwner);
          holo.set("year", year);
          holo.set("month", month);
          holo.set("date", date);
          holo.set("hour", hour);
          holo.set("min", min);
          holo.set("longitude", longitude);
          holo.set("latitude", latitude);

          holo.save();
          console.log("holo saved");
          dataIsEmpty = 0;
        
          } catch (e) {
            // 失敗したらエラーを表示
            console.log(e);
          }
    }
    else{
      Holo.equalTo("owner", holoOwner)
              .fetchAll()
              .then(function(results){
              if(results.length != 0){
                for (var i = 0; i < results.length; i++) {
                  var object = results[i];
                }
                object.set("year", year);
                object.set("month", month);
                object.set("date", date);
                object.set("hour", hour);
                object.set("min", min);
                object.set("longitude", longitude);
                object.set("latitude", latitude);
                object.update();
                }
              })
              .catch(function(err){
                // エラー処理
              });
      console.log("updated");
    }
  }
}

function loadMyPage(){
  var loadedMyPage = ncmb.DataStore("profile");
  loadedMyPage.equalTo("owner", ncmb.User.getCurrentUser().get("userName"))
          .fetchAll()
          .then(function(results){
            if(results.length != 0){
              for (var i = 0; i < results.length; i++) {
                var object = results[i];
              }
              $('#profileMessage').val(object.get("profileMessage"));
              var fileName = object.get("fileName")
              $qs('#preview img').src = `https://mbaas.api.nifcloud.com/2013-09-01/applications/${appId}/publicFiles/${fileName}`;
              dataIsEmpty = 0;
            }
          })
          .catch(function(err){
            console.log(err);
          });
}


function showTemplateDialog(Link) {
  var dialog = document.getElementById('my-dialog');
  //console.log(Link);
  var owner = Link.getAttribute("owner");
  var profiles = ncmb.DataStore("profile");
  profiles.equalTo("owner", owner)
              .fetchAll()
              .then(function(results){
                if(results.length != 0){
                  for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                  }
                  var content = object.profileMessage;
                  var fileName = object.fileName;
                  if (dialog) {
                    $('#dialogProfileMessage').val(content);
                    $qs('#dialogProfilePreview img').src = `https://mbaas.api.nifcloud.com/2013-09-01/applications/${appId}/publicFiles/${fileName}`;
                    var twitterLink = document.getElementById("userPageDialogTwitter");
                    var instagramLink = document.getElementById("userPageDialogInstagram");
                    twitterLink.setAttribute("link", object.twitter);
                    instagramLink.setAttribute("link", object.instagram);
                    dialog.show();
                  } 
                  else {
                    ons.createElement('dialog.html', { append: true }).then(function(dialog){
                      $('#dialogProfileMessage').val(content);
                      $qs('#dialogProfilePreview img').src = `https://mbaas.api.nifcloud.com/2013-09-01/applications/${appId}/publicFiles/${fileName}`;
                      var twitterLink = document.getElementById("userPageDialogTwitter");
                      var instagramLink = document.getElementById("userPageDialogInstagram");
                      twitterLink.setAttribute("link", object.twitter);
                      instagramLink.setAttribute("link", object.instagram);
                      dialog.show();
                    });
                  }
                }
              });
};

var showLinkRegisterDialog = function(sns) {
  var profile = ncmb.DataStore("profile");
  var dialog = document.getElementById('linkRegister-dialog');

  try{
    if (dialog) {
      if(sns == "twitter"){
        var button = document.getElementById('saveSNSEditBtn');
        button.setAttribute('onclick', 'saveSNSLink(`twitter`)');
        $('#editSNS').val(twitter);
        var textarea = document.getElementById('editSNS');
        textarea.setAttribute(`placeholder`, `https://twitter.com/以下の @****** 部を入力ください`);

      }
      else if(sns == "instagram"){
        var button = document.getElementById('saveSNSEditBtn');
        button.setAttribute('onclick', 'saveSNSLink(`instagram`)');
        $('#editSNS').val(instagram);
        var textarea = document.getElementById('editSNS');
        textarea.setAttribute(`placeholder`, `https://www.instagram.com/以下の ****** 部を入力ください`);
      }
      dialog.show();
    }
    else {
      profile.equalTo("owner", loginUser).fetchAll().then(function(results){
        if(results.length != 0){
          for (var i = 0; i < results.length; i++) {
            var object = results[i];
          }
          twitter = object.twitter;
          instagram = object.instagram;
          ons.createElement('linkRegisterDialog.html', { append: true }).then(function(dialog) {
            if(sns == "twitter"){
              var button = document.getElementById('saveSNSEditBtn');
              button.setAttribute('onclick', 'saveSNSLink(`twitter`)');
              $('#editSNS').val(twitter);
              var textarea = document.getElementById('editSNS');
              textarea.setAttribute(`placeholder`, `https://twitter.com/@******`);
            }
            else if(sns == "instagram"){
              var button = document.getElementById('saveSNSEditBtn');
              button.setAttribute('onclick', 'saveSNSLink(`instagram`)');
              $('#editSNS').val(instagram);
              var textarea = document.getElementById('editSNS');
              textarea.setAttribute(`placeholder`, `https://www.instagram.com/******`);
            }
            dialog.show();
          });
        }
      });
    }
  }
  catch (e) {
    // 失敗したらエラーを表示
    console.log(e);
    ons.notification.toast('編集画面が開けませんでした', {
      timeout: 2000
    });
  }
}

function saveSNSLink(sns){
  var owner = ncmb.User.getCurrentUser().get("userName");
  var profile = ncmb.DataStore("profile");

  try{
    profile.equalTo("owner", owner)
                .fetchAll()
                .then(function(results){
                  if(results.length != 0){
                    for (var i = 0; i < results.length; i++) {
                      var object = results[i];
                    }
                    if(sns == "twitter"){
                      var newTwitter = "https://twitter.com/"+$('#editSNS').val();
                      object.set("twitter", newTwitter);
                      object.update().then(function(){
                        hideDialog('linkRegister-dialog');
                        ons.notification.toast('変更が保存されました', {
                          timeout: 2000
                        });
                      });
                    }
                    else if(sns == "instagram"){
                      var newInsta = "https://www.instagram.com/"+$('#editSNS').val();
                      object.set("instagram", newInsta);
                      object.update().then(function(){
                        hideDialog('linkRegister-dialog');
                        ons.notification.toast('変更が保存されました', {
                          timeout: 2000
                        });
                      });
                    }
                  }
                })
  }
  catch (e) {
    // 失敗したらエラーを表示
    console.log(e);
    ons.notification.toast('変更が保存できませんでした', {
      timeout: 2000
    });
  } 
}



var hideDialog = function(id) {
  var dialog = document.getElementById(id)
  if(id=="edit-dialog")
  {
    console.log("pege updated");
    loadMyPosts();
  }
  dialog.hide();
};

function loadPosts(command=null){
  var totalPostNum =  document.getElementById("totalPostNum");
  var userProfile = ncmb.DataStore("profile");
  var skipNum = 0;
  var inputSkipNum =  $('#skipNum').val();
  var inputOwnerSerch = $('#ownerSerch').val();
  var inputStr = null;
  if(command == "latest"){
    $('#skipNum').val(null);
    inputSkipNum = null;
  }
  else{
    if(inputOwnerSerch != null){
      inputStr = String(inputOwnerSerch);
    }
    if(! isNaN(inputSkipNum)){
      inputSkipNum = Number(inputSkipNum);
      if(Number.isInteger(inputSkipNum))
      {
        skipNum = inputSkipNum;
      }
    }
  }
  var postList = [];
  var currentPosts = ncmb.DataStore("post");
  currentPosts.count().fetchAll().then(function(results){
    if(results.length != 0){
      var postNumMsg = "現在の総投稿数は " + results.count + " 件です。投稿ありがとうございます！";
    }
    else{
      var postNumMsg = "現在の総投稿数は 0 件です";
    }
    totalPostNum.innerHTML = postNumMsg;
  })

  var loginUser = ncmb.User.getCurrentUser().get("userName");
  userProfile.equalTo("owner", loginUser).fetchAll().then(function(results){
    if(results.length != 0){
      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        var likeList = object.likeList;
      }
    }
    return likeList;
  })
  .then(function(likeList){
    if(command == null || command == "latest"){
      if(inputStr){
        var tempObject = currentPosts.equalTo("owner", inputStr).skip(skipNum);
      }
      else{
        var tempObject = currentPosts.skip(skipNum);
      }
    }
    else if(command=="like"){
      console.log("start serch post by likeList");
      if(inputStr){
        var tempObject = currentPosts.in("objectId",likeList).equalTo("owner", inputStr).skip(skipNum);
      }
      else{
        var tempObject = currentPosts.in("objectId",likeList).skip(skipNum);
      }
    }
    else if(command=="popular"){
      if(inputStr){
        var tempObject = currentPosts.equalTo("owner", inputStr).order("good").skip(skipNum);
      }
      else{
        var tempObject = currentPosts.order("good").skip(skipNum);
      }
    }
    tempObject.fetchAll().then(function(results){
      if(results.length != 0){
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          date = new Date(object.saveDate);
          console.log(`loaded likeList = ${likeList}`);
          postList.unshift({owner:object.owner, saveDate:date, title:object.title, content:object.content, objectId:object.objectId, good:object.good, userObjectId:object.userObjectId});
        }
        var likeList = likeList;
        var iconList = Array(postList.length);
        var promises = [];
        for (var i = 0; i < postList.length; i++) {
          var postOwner = postList[i].owner;
          var userObjectId = postList[i].userObjectId;
          console.log(userObjectId);
          promises.push(userProfile
              .fetchById(userObjectId)
              .then(function(item){
                console.log(item);
                return `https://mbaas.api.nifcloud.com/2013-09-01/applications/${appId}/publicFiles/${item.fileName}`;
              }));
        }
        return Promise.all(promises);
      }
      else{
        ons.notification.alert("投稿が見つかりません",alertOptions)
      }
    }).then(function(results) {
      var iconList = [];
      results.forEach(function(value) {
        console.log(value);
        iconList.push(value);
      })
      makelazy(postList, postList.length, 'infinite-list', likeList, iconList);
    }).catch(function(e){
      console.log(e);
    });
  });
}

function loadMyPosts(){
  makeADGTag(10722, 'adg');
  var postList = [];
  var currentPosts = ncmb.DataStore("post");
  currentPosts.equalTo("owner", ncmb.User.getCurrentUser().get("userName"))
              .fetchAll()
              .then(function(results){
    if(results.length != 0){
      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        date = new Date(object.saveDate);
        postList.unshift({owner:object.owner, saveDate:date, title:object.title, content:object.content, objectId:object.objectId});
      }
      makelazy(postList, postList.length, 'infinite-Mylist');
    }
    else{
      makelazy(postList, postList.length, 'infinite-Mylist');
      ons.notification.alert("投稿が見つかりません",alertOptions)
    }
  })
};

var makelazy = function(recData, recDataLength, listName, likeList=[], iconList){
  var infiniteList = document.getElementById(listName);
  infiniteList.delegate = {
    createItemContent: function(i) {
      if(listName == 'infinite-list'){
        if(recData[i].good){
          var goodNum = recData[i].good;
        }
        else{
          goodNum = 0;
        }
        if(likeList.includes(recData[i].objectId))
        {
          console.log(`object ID ${recData[i].objectId} is detected in likeList`);
          var likeBtnColor = "red";
        }
        else
        {
          var likeBtnColor = "white";
        }
        
        dom = ons.createElement(
        `<div>
          <ons-list-header modifier="timestamp">${recData[i].saveDate}</ons-list-header>
          <ons-list-item modifier="iconowner">
            <div class="left">
              <img class="icon_inside" src="${iconList[i]}" alt="Onsen UI">
              <a href="#" owner=${recData[i].owner} onclick="showTemplateDialog(this)">&nbsp;書き手:${recData[i].owner}さん</a>
            </div>
            <div class="right">
              <i pk="${recData[i].objectId}" onclick="goodBtn(this)" modifier="nospace" id="goodBtnIcon_${recData[i].objectId}" class="fa fa-heart fa-2x" style="color: ${likeBtnColor};"></i>
              <p class="nospace" id="goodBtnNumber_${recData[i].objectId}">&nbsp;${goodNum}&nbsp;LIKE&nbsp;</p>
            </div>
          </ons-list-item>
          <ons-list-item modifier="content">
            <details>
              <summary>[題]&nbsp;${recData[i].title}</summary>
              <div class="kaigyou">${recData[i].content}</div>
            </details>
          </ons-list-item>
        </div>`);
      }
      else{
        dom = ons.createElement(
        `<div>
          <ons-list-header>${recData[i].saveDate}</ons-list-header>
            <details>
              <summary>[題]&nbsp;${recData[i].title}</summary>
              <br>
              ${recData[i].content}
            </details>
            <ons-list-item>
              <ons-button id="${recData[i].objectId}" onclick="editPost(this)">編集</ons-button>&nbsp;
              <ons-button id="${recData[i].objectId}" onclick="deletePost(this)">削除</ons-button>
            </ons-list-item>
        </div>`);
      };
      return dom;
    },
    countItems: function() {
      return recDataLength;
    },
    calculateItemHeight:function() {
      return 10;
    }
  };
  infiniteList.refresh();
};

//============================= delete post feature =============================

function deletePost(editButtonHTML){
  var recordId = editButtonHTML.id
  console.log(recordId);
  var currentPosts = ncmb.DataStore("post");
 
  try{
    currentPosts.equalTo("objectId", recordId)
                .fetchAll()
                .then(function(results){
                  if(results.length != 0){
                    for (var i = 0; i < results.length; i++) {
                      var object = results[i];
                      object.delete().then(function(results){
                        loadMyPosts();
                        ons.notification.toast('正常に削除されました', {
                          timeout: 2000
                        });
                      })
                    }
                  }
                })
  }
  catch (e) {
    // 失敗したらエラーを表示
    console.log(e);
    ons.notification.toast('削除に失敗しました!', {
      timeout: 2000
    });
  }
}

//============================= Edit Post Feature =============================
function editPost(editButtonHTML){
  var recordId = editButtonHTML.id
  console.log(recordId);
  var currentPosts = ncmb.DataStore("post");
 
  try{
    currentPosts.equalTo("objectId", recordId)
                .fetchAll()
                .then(function(results){
                  if(results.length != 0){
                    for (var i = 0; i < results.length; i++) {
                      var object = results[i];
                      var text = object.content;
                      var title = object.title;
                      editDialogWindow(text, title, recordId);
                      console.log(text);
                    }
                  }
                })
  }
  catch (e) {
    // 失敗したらエラーを表示
    console.log(e);
    ons.notification.toast('編集画面が開けませんでした', {
      timeout: 2000
    });
  }
}

var editDialogWindow = function(text, title, recordId) {
  var dialog = document.getElementById('edit-dialog');

  if (dialog) {
    $('#editContent').val(text);
    $('#editTitle').val(title);
    btn = document.getElementById('saveEditBtn');
    btn.pk = recordId;
    dialog.show();
    
  } else {
    ons.createElement('editDialogWindow.html', { append: true })
    .then(function(dialog) {
        $('#editContent').val(text);
        $('#editTitle').val(title);
        btn = document.getElementById('saveEditBtn');
        btn.pk = recordId;
        dialog.show();
      });
  }
};


async function saveEditPost(editButtonHTML){
  var recordId = editButtonHTML.pk
  console.log(recordId);
  var currentPosts = ncmb.DataStore("post");

  try{
    currentPosts.equalTo("objectId", recordId)
                .fetchAll()
                .then(function(results){
                  if(results.length != 0){
                    for (var i = 0; i < results.length; i++) {
                      var object = results[i];
                      console.log(object);
                      var newTitle = $('#editTitle').val();
                      var newText = $('#editContent').val();
                      object.set("title", newTitle);
                      object.set("content", newText);
                      object.update().then(function(){
                        loadMyPosts();
                        hideDialog('edit-dialog');
                        ons.notification.toast('変更が保存されました', {
                          timeout: 2000
                        });
                      });
                    }
                  }
                })
  }
  catch (e) {
    // 失敗したらエラーを表示
    console.log(e);
    ons.notification.toast('変更が保存できませんでした', {
      timeout: 2000
    });
  } 
}

//============================= good button feature =============================

function goodBtn(goodBtnHTML){
    var recordId = goodBtnHTML.getAttribute('pk');
    var goodBtnNumber = "goodBtnNumber_" + recordId;
    var goodBtnIconId = "goodBtnIcon_" + recordId;
    var currentPosts = ncmb.DataStore("post");
    var loginUser = ncmb.User.getCurrentUser().get("userName");
    var profile = ncmb.DataStore("profile");
    var NotSelfBtn = true;

    if(NotSelfBtn){
    try{
        currentPosts.equalTo("objectId", recordId)
            .fetchAll()
            .then(function(results){
            if(results.length != 0){
                for (var i = 0; i < results.length; i++) {
                var object = results[i];
                if(object.owner == loginUser){
                    console.log("can not push likeBtn for yourself post");
                    NotSelfBtn = false;
                }
                }
            }
        })
        .then(function(){
            if(NotSelfBtn){
                profile.equalTo("owner", loginUser)
                    .fetchAll()
                    .then(function(results){
                    if(results.length != 0){
                        for (var i = 0; i < results.length; i++) {
                        var object = results[i];
                        if(object.likeList){
                            var likeList = object.likeList;
                            if(likeList.includes(recordId)){
                            likeList = likeList.filter(element => !(element == recordId));
                            var updown = "down";
                            }
                            else{
                            likeList.push(recordId);
                            var updown = "up";
                            }
                            object.set("likeList",likeList);
                            object.update();
                        }
                        else{
                            var likeList = [];
                            likeList.push(recordId);
                            object.set("likeList",likeList);
                            object.update();
                            var updown = "up";
                        }    
                        }
                    }
                    return updown;
                    })
                    .then(function(updown){
                    currentPosts.equalTo("objectId", recordId)
                    .fetchAll()
                    .then(function(results){
                    if(results.length != 0){
                        for (var i = 0; i < results.length; i++) {
                        var object = results[i];
                        if(object.good == null){
                            object.set("good", 1);
                            object.update();
                        }
                        else{
                            var goodNum = object.good;
                            if(updown == "up"){
                            goodNum += 1;
                            console.log(`good Num += 1 for ${recordId}`);
                            object.set("good", goodNum);
                            }
                            else if(updown == "down"){
                            goodNum -= 1;
                            console.log(`good Num -= 1 for ${recordId}`);
                            object.set("good", goodNum);
                            }
                            object.update().then(function(results){
                            console.log(`New goodNum= ${goodNum}`);
                            
                        })
                        }
                        var currentGoodBtn = document.getElementById(goodBtnNumber);
                        var newGoodNumView = "&nbsp;"+goodNum+"&nbsp;LIKE&nbsp;";
                        currentGoodBtn.innerHTML = newGoodNumView;
                        var currentGoodBtnIcon = document.getElementById(goodBtnIconId);
                        if(updown == "up"){
                            currentGoodBtnIcon.style.color = "red";
                        }
                        else{
                            currentGoodBtnIcon.style.color = "white";
                        }
                        }
                    }
                    })
                });
            }
            else{
                ons.notification.toast('あなたの投稿です', {
                    timeout: 2000
                });
            };
        });
    }
    catch (e) {
        // 失敗したらエラーを表示
        console.log(e);
        //ons.notification.toast('Failed!', {
        //timeout: 2000
        //});
    }
    }
}

