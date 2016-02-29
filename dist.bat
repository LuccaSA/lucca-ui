echo node package manager
call npm install
echo bower
call bower install
echo compiling sass
call grunt sass
echo compiling all
call grunt dist
echo Lucca-ui ready to use
echo /dist/lucca-ui.min.js
echo /dist/lucca-ui.global.min.css
pause