def calculate_delivery_cost(i, base_cost, weight, distance, offer):
    base = base_cost + weight * 10 + distance * 5 
    discount = 0

    if distance < 200 and (weight >= 70 and weight <= 200) and offer == 'OFR001':
        discount = 10
    elif (distance >= 50 and distance <= 150) and (weight >= 100 and weight <= 250)  and offer == 'OFR002':
        discount = 7
    elif (distance >= 50 and distance <= 250) and (weight >= 10 and weight <= 150)  and offer == 'OFR003':
        discount = 5
    
    discount_cost = (base * discount) / 100
    final_cost = base - discount_cost

    return f"pkg{i} {discount_cost} {final_cost}"

def main():
    base_cost = float(input("Enter the base delivery cost: "))
    number_of_package = int(input("Enter number of packages: "))
    result = []
    for i in range(1,number_of_package+1):
        weight = float(input(f"Enter the weight of the package {i} (in kg): "))
        distance = float(input(f"Enter the distance of delivery for package {i} (in km): "))
        offer = input(f"Enter the offer code (optional) for package {i}: ")
        delivery_cost = calculate_delivery_cost(i, base_cost, weight, distance, offer)
        result.append(delivery_cost)

    for i in range(len(result)):
        print(f'{result[i]}')

if __name__ == '__main__':
    main()
