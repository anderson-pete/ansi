#!/bin/bash -e

# These tests primarily ensure that everything works the same in both CJS and ESM modes,
# with both JavaScript and TypeScript.

cd "$(dirname "$0")"

files=(test.[cm][jt]s test.ts)

green=$'\e[32m'
magenta=$'\e[35m'
default=$'\e[39m'
open=$magenta\<\($default
close=$magenta\)$default

function cmd() { echo "$green$1$default"; }
function subst() {
	local var=$1
	local cmd=$2
	shift 2

	echo "$open$var $(cmd "$cmd") $*$close";
}

diff=$(cmd diff)

for color in '' 0 1 2 3; do
	for (( i = 0; i < ${#files[@]}; i++ )); do
		left_file=${files[i]}
		left=(
			FORCE_COLOR=$color
			$([[ $left_file = test.?js ]] && echo node || echo "npx tsx")
			"$left_file"
		)

		for (( j = i + 1; j < ${#files[@]}; j++ )); do
			right_file=${files[j]}
			right=(
				FORCE_COLOR=$color
				$([[ $right_file = test.?js ]] && echo node || echo "npx tsx")
				"$right_file"
			)

			printf '%38s %s\n' "$diff $(subst "${left[@]}")" "$(subst "${right[@]}")"
			eval "diff <(${left[*]}) <(${right[*]})"
		done
	done
done

echo
echo "$(cmd npx) tsx test.cjs"
node test.cjs