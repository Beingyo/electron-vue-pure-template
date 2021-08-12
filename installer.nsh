!macro customInstall
  DeleteRegKey HKCR "electron-vue-pure-template"
  WriteRegStr HKCR "electron-vue-pure-template" "" "URL:electron-vue-pure-template"
  WriteRegStr HKCR "electron-vue-pure-template" "URL Protocol" ""
  WriteRegStr HKCR "electron-vue-pure-template\shell" "" ""
  WriteRegStr HKCR "electron-vue-pure-template\shell\Open" "" ""
  WriteRegStr HKCR "electron-vue-pure-template\shell\Open\command" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME} %1"
!macroend

!macro customUnInstall
  DeleteRegKey HKCR "electron-vue-pure-template"
!macroend
