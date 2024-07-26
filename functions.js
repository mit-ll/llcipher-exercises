
const modExp = function (a, b, n) {
    a = a % n;
    let result = 1n;
    let x = a;
    while (b > 0) {
        let leastSignificantBit = b % 2n;
        b = b / 2n;
        if (leastSignificantBit == 1n) {
            result = result * x;
            result = result % n;
        }
        x = x * x;
        x = x % n;
    }
    return result;
};

const bigintExp = function (a, b) {
    let result = 1n;
    let x = a;
    while (b > 0) {
        let leastSignificantBit = b % 2n;
        b = b / 2n;
        if (leastSignificantBit == 1n) {
            result = result * x;
        }
        x = x * x;
    }
    return result;
};

const textToNumber = function (txt) {
	let result = 0n;
	for (let i=0; i<txt.length; i++) {
		result = result * 256n;
		result = result + BigInt(txt.charCodeAt(i));
	}
	return result;
}

const numberToText = function (num) {
	let result = "";
	while(num > 0n) {
		let ch = String.fromCharCode(Number(num % 256n));
		num = num / 256n;
		result = ch + result;
	}
	return result;
}

// returns [g, x, y] where g=gcd(a,b), x*a = g (mod b), y*b = g (mod a)
const extendedGCD = function (a, b) {
	let res = extendedGCDHelper(a, b);
	let ainvmodb = res[1];
	if (ainvmodb < 0n) {
		ainvmodb = ainvmodb + b;
	}
	let binvmoda = res[2];
	if (binvmoda < 0n) {
		binvmoda = binvmoda + a;
	}
	return [res[0], ainvmodb, binvmoda];
}

// returns [g, x, y] where g=gcd(a,b), x*a + y*b = g (over the integers)
const extendedGCDHelper = function (a, b) {
	if (b == 0n) {
		return [a, 1n, 0n];
	}
	let factor = a / b;
	let remainder = a - (b * factor);
	let res = extendedGCDHelper(b, remainder);
	return [res[0], res[2], res[1] - (factor*res[2])];
}

const modinv = function (a, n) {
	let res = extendedGCD(n, a);
	if (res[0] != 1n) {
		return 0n;
	}
	return res[2];
}

const modprod = function (a, b, n) {
	return (a*b)%n;
}

const modsum = function (a, b, n) {
	return (a + b) % n;
}

// Binary search for r-th root of a, maintaining lower and upper bounds for each subcall
const rootHelper = function(r, a, lb, ub) {
	if (ub-lb <= 1n) {
		return lb
	}
	let mid = (lb + ub) / 2n;
	let midpow = bigintExp(mid, r);
	if (midpow <= a) {
		return rootHelper(r, a, mid, ub);
	}
	return rootHelper(r, a, lb, mid);
}

// Returns floor(a^(1/r)), assuming nonnegative integer a and positive integer r.
const root = function (r, a) {
	if (r < 1n) {
		return 0n;
	}
	if (a < 0n) {
		return 0n;
	}
	return rootHelper(r, a, 0n, a);
}

// Math.random() generates floating-point Numbers, not BigInts.  
// So if x is too big, break it into chunks with separate random calls.  
// Add 1 to the limit for the "top" chunk to get uniformity over the whole interval less than x.
// This *can* result in a returned value greater than x.
const chunkSize = 1000000000000n;
const getRandomBigIntWithMaxGreaterThan = function (x) {
	if (x < chunkSize) {
		return BigInt( Math.floor( Math.random() * Number(x + 1n) ) );
	}
	else {
		let highOrderRandomness = getRandomBigIntWithMaxGreaterThan(x / chunkSize);
		return (chunkSize * highOrderRandomness) + BigInt(Math.floor(Math.random() * Number(chunkSize)));
	}
}

// get a random value from a *larger* interval, 
// then retry if we pick something greater than x
const getRandomBigIntLessThan = function (x) {
	let r = getRandomBigIntWithMaxGreaterThan(x);
	while (r >= x) {
		r = getRandomBigIntWithMaxGreaterThan(x);
	}
	return r;
}

// Helper function for the Miller-Rabin check.  
// Returns the maximum integer d such that 2^d divides x.
const getMaxFactorsOfTwo = function (x) {
	let numTwos = 0;
	let lsb = x % 2n;
	while (lsb == 0n) {
		numTwos = numTwos + 1;
		x = x / 2n;
		lsb = x % 2n;
	}
	return numTwos;
}

const sieveValue = 2310n;  // 2*3*5*7*11
const millerRabinIterations = 32;

// Perform a quick sieve check for small prime factors.  
// If that passes, perform Miller-Rabin.
const isProbablePrime = function(x) {
	let egcd = extendedGCD(x, sieveValue);
	if (egcd[0] == 1n) {
		let xm = x - 1n;
		let numTwos = getMaxFactorsOfTwo(xm);
		let oddFactor = x / bigintExp(2n, BigInt(numTwos));
		for (let i = 0; i < millerRabinIterations; i++){
			// get a value between 2 and x-2 inclusive
			let base = 2n + getRandomBigIntLessThan(x - 3n);
			let res = modExp(base, oddFactor, x);
			if (res == 1n) {
				continue;
			}
			else {
				let isPossiblePrime = false;
				for (let j = 0; j <= numTwos; j++) {
					if (res == x - 1n) {
						isPossiblePrime = true;
						break;
					}
					res = res * res % x;
				}
				if (isPossiblePrime == false) {
					return false;
				}
			}
		}
		return true;
	}
	else {
		return false;
	}
}

// Get a random exactly-k-bit odd number by picking k-2 random bits 
// and putting a 1 at the beginning and end
// (aka:  pick a random number between 0 and 2^(k-2)-1, add 2^(k-2), 
// then multiply by 2 and add 1)
// Then check for primality; if not prime, try again.
const getRandomPrime = function (numBits) {
	let a = bigintExp(2n, BigInt(numBits - 2));
	let b = 0n;
	let isPrime = false;
	while (isPrime == false) {
		let r = getRandomBigIntLessThan(a);
		b = 2n * (a+r) + 1n;
		isPrime = isProbablePrime(b);
	}
	return b;
}

const rsa_bits = 512;
// Returns a new random set of RSA parameters (n, e, p, q, d)
// Reminder:
// n: modulus
// e: public exponent
// p, q: primes
// d: e^-1 mod phi(n)
const genRSA = function (numBits) {
	let p = getRandomPrime(Math.floor((numBits+1)/2));
	let q = getRandomPrime(Math.floor(numBits/2));
	let n = p * q;
	let e = 3n;
	let phin = (p-1n)*(q-1n);
	let gcdres = extendedGCD(phin, e);
	while (gcdres[0] > 1n) {
		e = e + 2n;
		gcdres = extendedGCD(phin, e);
	}
	return [n, e, p, q, gcdres[2]];  // gcdres[2] = d = e^(-1) mod phi(n)
}

// Returns a new random set of RSA parameters (n, e, p, q, d) where e is predefined.
// Please don't pass in a non-prime e.
// Since we need e*d = 1 mod phi(n), e has to be relatively prime to phi(n) = (p-1)(q-1).
// So, (p-1) % e must be nonzero; or,
// p % e != 1.
// Also, p % e != 0 assuming p != e, since they're both prime.
// The same is true of q.
// So, we require that p % e > 1 and q % e > 1.
const genRSAWithPubExp = function (numBits, pubexp) {
	let e = BigInt(pubexp)
	let p = getRandomPrime(Math.floor((numBits+1)/2));
	while (p % e < 2n) {
		p = getRandomPrime(Math.floor((numBits+1)/2));
	}
	let q = getRandomPrime(Math.floor(numBits/2));
	while (q % e < 2n) {
		q = getRandomPrime(Math.floor(numBits/2));
	}
	let n = p * q;
	let phin = (p-1n)*(q-1n);
	let gcdres = extendedGCD(phin, e);
	return [n, e, p, q, gcdres[2]];  // gcdres[2] = d = e^(-1) mod phi(n)
}

const message_verbs = ["march on", "charge", "sail to", "leave for", "attack", "fire on"];
const message_locations = ["capital", "bay", "tower", "fort", "castle", "port", "village"];
const message_times = ["dawn", "noon", "dusk", "midnight", "3am", "3pm"];
const short_verbs = ["march", "fire", "charge", "sail", "attack"];
const short_times = ["@ 1", "@ 2", "@ 3", "@ 4", "@ 5", "@ 6", "@ 7", "@ 8", "@ 9", "@ 10", "@ 11", "@ 12", "now"];

const getShortMessage = function() {
	let verb = message_verbs[Math.floor(Math.random() * message_verbs.length)];
	let loc = message_locations[Math.floor(Math.random() * message_locations.length)];
	let time = message_times[Math.floor(Math.random() * message_times.length)];
	return verb + " the " + loc + " at " + time;
}

const getVeryShortMessage = function() {
	let verb = short_verbs[Math.floor(Math.random() * short_verbs.length)];
	let time = short_times[Math.floor(Math.random() * short_times.length)];
	return verb + " " + time;
}

// Factor RSA modulus n, given a value (e*d) that is 1 mod phi(n).
// -Let y be the largest odd factor of e*d - 1.
// -Choose random r; compute r^y mod n.  
// -If this value is 1 mod n, pick a new r.  Otherwise, we know that r^(e*d - 1) = 1 mod n.  So if we iteratively square r^y, at some point we will obtain a value x that is not 1 mod n, but whose square is 1 mod n.
// -Since there are exactly two square roots of 1 modulo any prime (1 and p-1), for an RSA modulus n=pq there are exactly four square roots of 1:  1 (=1 mod p and 1 mod q), n-1 (= p-1 mod p and q-1 mod q), a value that is 1 mod p and -1 mod q, and vice versa.
// -If x is n-1, retry with a new r.  Otherwise, note that x-1 is exactly a multiple of p *or* q, but *not* both.  So the GCD of x and n gives a nontrivial factor of n.
const factorn = function(n, ed) {
	let y = (ed - 1n)/2n;
	while (y % 2n == 0n) {
		y = y / 2n;
	}
	let nminusone = n - 1n;
	let x = nminusone;
	
	while ((x == nminusone) || (x == 1n)) {
		let r = getRandomBigIntLessThan(n-3n) + 2n;
		let x = modExp(r, y, n);
		let next = x * x % n;
		while (next != 1n) {
			x = next;
			next = x * x % n;
		}
	}
	
	let egcd = extendedGCD(x-1n, n);
	return [egcd[0], n / egcd[0]];
}
	

