unmap <Space>

" Have j and k navigate visual lines rather than logical ones
nmap j gj
nmap k gk


exmap back obcommand app:go-back
nmap <Space>b :back<CR>

exmap forward obcommand app:go-forward
nmap <Space>f :forward<CR>

exmap follow_link obcommand editor:follow-link
nmap <Space>o :follow_link<CR>

" Finally, this plugin also provides the following motions/mappings by default:
" [[ and ]] to jump to the previous and next Markdown heading.
" zk and zj to move up and down while skipping folds.
" gl and gL to jump to the next and previous link.
" gf to open the link or file under the cursor (temporarily moving the cursor if necessary—e.g. if it's on the first square bracket of a [[Wikilink]]).

" this one conflicts with the one above moving from different links
exmap surround_wiki surround [[ ]]
exmap surround_double_quotes surround " "
exmap surround_single_quotes surround ' '
exmap surround_backticks surround ` `
exmap surround_brackets surround ( )
exmap surround_square_brackets surround [ ]
exmap surround_curly_brackets surround { }

" NOTE: must use 'map' and not 'nmap'
" map [[ :surround_wiki<CR>
nunmap s
vunmap s
map s" :surround_double_quotes<CR>
map s' :surround_single_quotes<CR>
map s` :surround_backticks<CR>
map sb :surround_brackets<CR>
map s( :surround_brackets<CR>
map s) :surround_brackets<CR>
map s[ :surround_square_brackets<CR>
map s] :surround_square_brackets<CR>
map s{ :surround_curly_brackets<CR>
map s} :surround_curly_brackets<CR>