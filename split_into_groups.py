import re
import os
from optparse import OptionParser

def split_into_groups(keylength, text):
    """Splits the given text into keylength groups, where each group is every
    keylength-th letter."""
    alphabetic_text = re.sub("[^{a-zA-Z}]", "", text)
    groups = [[] for idx in xrange(keylength)]
    for (idx, char) in zip(range(len(alphabetic_text)), alphabetic_text):
        groups[idx % keylength].append(char)
    return ["".join(group) for group in groups]

PARSER = OptionParser()
PARSER.add_option(
    "-c", "--ciphertextfile",
    help="the path of the file containing the ciphertext")
PARSER.add_option(
    "-d", "--destfile",
    help="the path of the file to which we want to write the grouped letters")
PARSER.add_option(
    "-k", "--keywordlength",
    help="the length of the keyword")

if __name__ == "__main__":
    # Parse the arguments and leave early if there aren't any
    #
    (options, args) = PARSER.parse_args()
    #print(options, args, len(args))
    necessary_arguments = ['ciphertextfile', 'destfile', 'keywordlength']
    for necessary in necessary_arguments:
        if not options.__dict__[necessary]:
            print("Missing one or more necessary arguments [%s]" % necessary)
            PARSER.print_help()
            exit(-1)

    # Everything is good so far. Process the arguments
    #
    ctxtfile = open(options.ciphertextfile, 'r')
    ctxt = ctxtfile.read()
    ctxtfile.close()
    groups = split_into_groups(int(options.keywordlength), ctxt)
    destfile = open(options.destfile, 'w')
    destfile.write(os.linesep.join(groups))
    destfile.close()
