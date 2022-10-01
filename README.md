# Huffman-algorithm
Сыромятников Д.О. КНМО-101(МЕН-120206)

node huffman.js [code|decode|codeToFile|decodeFromFile] '[!]SEQUENCE'

code - make codeTable of SEQUENCE's symbols using Huffman-algorithm(tree). Saves the table in 'codeTable.json', encode SEQUENCE using code table and print result.

decode - decode SEQUENCE using code table in 'codeTable.json'. print result.

codeToFile - make codeTable of SEQUENCE's symbols using Huffman-algorithm(tree). Saves the table in 'codeTable.json', encode SEQUENCE using code table, compress result and saves in 'out.coded'. print compressed sequence.

decodeFromFile - decode SEQUENCE from file using code table in 'codeTable.json'. print result.

[!] without take sequence as string, with - as a file name where take SEQUENCE (for code, decode, codeToFile commands).

p.s Нужно добавить больше проверок. Но вроде работает...
