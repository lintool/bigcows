import csv
import re
import sys

earliest_year = {}

with open('earliest-year.csv', newline='') as f:
    reader = csv.reader(f, delimiter=',', quotechar='\\')
    for row in reader:
        #print(row)
        earliest_year[row[1]] = row[2]

#print(earliest_year)

year = None
for line in sys.stdin:
    line = line.rstrip()

    #"url": "http://scholar.google.com/citations?user=jee2Dy0AAAAJ",

    match = re.search(r'http://scholar.google.com/citations\?user=([^"]+)', line)
    if match:
        print(line)
        id = match.group(1)
        if id in earliest_year:
            year = earliest_year[id]
        else:
            year = None
        #print('####' + match.group(1) + str(year))
    elif re.match(r'    "year": "\d+"', line):
        #print('!!!!!' + line + ' ' + str(year))
        if year:
            print(f'    "year": "{year}"')
        else:
            print(line)
    else:
        print(line)
