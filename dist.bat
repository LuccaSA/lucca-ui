echo node package manager
call npm install --production --progress=false
echo bower
call bower install --production
echo tsd
call tsd install
echo compiling all
call grunt dist
echo Lucca-ui ready to use
echo /dist/lucca-ui.min.js
echo /dist/lucca-ui.global.min.css
pause