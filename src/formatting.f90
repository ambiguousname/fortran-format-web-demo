integer function test(b) result(a)
	integer, intent(IN) :: b
	print*, b
	a = b
end